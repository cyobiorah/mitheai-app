import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  UserCredential,
} from "firebase/auth";
import { doc, getDoc, setDoc, collection } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { ROUTES } from "../utils/contstants";
import { User, Organization, Team, AuthState } from "../types";
import { teamsApi } from "../api/teams";
import { invitationsApi } from "../api/invitations";
import toast from "react-hot-toast";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshTeams: () => Promise<void>;
  error: string | null;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  organizationName?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);

  const fetchUserData = async (uid: string): Promise<User | null> => {
    console.log("Fetching user data for UID:", uid);
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        const user = { ...userData, id: userDoc.id };
        console.log("Fetched user data:", user);
        setUser(user);
        return user;
      } else {
        console.log("No user document found for uid:", uid);
        setError("User account not fully set up. Please contact support.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to fetch user data");
      return null;
    }
  };

  const fetchOrganization = async (organizationId: string): Promise<void> => {
    try {
      console.log("Fetching organization with ID:", organizationId);
      const orgDoc = await getDoc(doc(db, "organizations", organizationId));
      if (orgDoc.exists()) {
        const orgData = orgDoc.data() as Organization;
        const org = { id: orgDoc.id, ...orgData };
        console.log("Fetched organization:", org);
        setOrganization(org);
      }
    } catch (error) {
      console.error("Error fetching organization:", error);
      setError("Failed to fetch organization data");
    }
  };

  const fetchTeams = async (organizationId: string): Promise<void> => {
    try {
      console.log("Fetching teams for organization ID:", organizationId);
      const fetchedTeams = await teamsApi.getTeams(organizationId);
      console.log("Fetched teams:", fetchedTeams);
      setTeams(fetchedTeams);
    } catch (error) {
      console.error("Error fetching teams:", error);
      setError("Failed to fetch teams");
    }
  };

  const refreshTeams = async () => {
    if (organization) {
      setError(null);
      await fetchTeams(organization.id);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setError(null);
      try {
        if (firebaseUser) {
          const userData = await fetchUserData(firebaseUser.uid);
          if (userData?.organizationId) {
            await Promise.all([
              fetchOrganization(userData.organizationId),
              fetchTeams(userData.organizationId),
            ]);
          }
        } else {
          setUser(null);
          setOrganization(null);
          setTeams([]);
        }
      } catch (error) {
        console.error("Error in auth state change:", error);
        setError("Authentication state change failed");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null); // Clear any existing errors
    try {
      const { user: firebaseUser } = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // todo: add email verification note do not remove this
      // if (!firebaseUser.emailVerified) {
      //   await signOut(auth);
      //   throw new Error("Please verify your email before logging in. Check your inbox for the verification link.");
      // }

      const userData = await fetchUserData(firebaseUser.uid);
      if (!userData) {
        await signOut(auth);
        // throw new Error("User account not fully set up. Please contact support.");
        toast.error("User account not fully set up. Please contact support.");
        return;
      }

      if (userData.organizationId) {
        await Promise.all([
          fetchOrganization(userData.organizationId),
          fetchTeams(userData.organizationId),
        ]);

        // Check if user has no teams and is not super_admin
        if (userData.teamIds.length === 0 && userData.role !== "super_admin") {
          await signOut(auth);
          throw new Error(
            "Your account is pending team assignment. Please contact your organization administrator."
          );
        }

        // Only navigate if everything is successful
        navigate(ROUTES.DASHBOARD);
      } else {
        await signOut(auth);
        throw new Error("User account not associated with an organization.");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      if (
        error?.code === "auth/user-not-found" ||
        error?.code === "auth/wrong-password"
      ) {
        setError("Invalid email or password.");
      } else {
        setError(error.message || "Failed to login. Please try again.");
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const orgRef = doc(collection(db, "organizations"));
      const organization: Omit<Organization, "id"> = {
        name: data.organizationName || `${data.firstName}'s Organization`,
        type: "startup",
        settings: {
          permissions: [],
          maxTeams: 5,
          maxUsers: 10,
          features: []
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const teamRef = doc(collection(db, "teams"));
      const team: Omit<Team, "id"> = {
        name: "Default Team",
        organizationId: orgRef.id,
        memberIds: [],
        settings: {
          permissions: []
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const userData: Omit<User, "id"> = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: "org_owner",
        organizationId: orgRef.id,
        teamIds: [teamRef.id],
        status: "active",
        uid: firebaseUser.uid,
        settings: {
          permissions: [],
          theme: 'light',
          notifications: []
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await Promise.all([
        setDoc(orgRef, organization),
        setDoc(teamRef, team),
        setDoc(doc(db, "users", firebaseUser.uid), userData),
      ]);

      // Send invitation email
      try {
        console.log("Sending invitation with data:", {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: "org_owner",
          organizationId: orgRef.id,
          teamIds: [teamRef.id],
        });
        const response = await invitationsApi.sendInvitation({
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: "org_owner",
          organizationId: orgRef.id,
          teamIds: [teamRef.id],
        });
        console.log("Invitation API response:", response);
      } catch (error: any) {
        console.error("Error sending invitation email:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        // Don't throw error here, as the user is already created
      }

      await Promise.all([fetchOrganization(orgRef.id), fetchTeams(orgRef.id)]);

      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      console.error("Registration error:", error);
      setError("Failed to register. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setError(null);
    try {
      await signOut(auth);
      setUser(null);
      setOrganization(null);
      setTeams([]);
      navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error("Logout error:", error);
      setError("Failed to logout");
      throw error;
    }
  };

  const value = {
    user,
    organization,
    teams,
    loading,
    error,
    login,
    register,
    logout,
    refreshTeams,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
