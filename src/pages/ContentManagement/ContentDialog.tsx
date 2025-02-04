import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Autocomplete,
  Chip,
  SelectChangeEvent,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { createContent, updateContent } from '../../api/content';
import { ContentItem } from '../../types';

interface ContentDialogProps {
  open: boolean;
  onClose: () => void;
  content: ContentItem | null;
  onSave: () => void;
}

interface FormData {
  title: string;
  description: string;
  type: 'article' | 'social_post' | 'video' | 'image' | 'document';
  content: string;
  url?: string;
  metadata: {
    source: string;
    language: string;
    tags: string[];
    customFields: Record<string, any>;
  };
  analysis: {
    sentiment?: number;
    keywords?: string[];
    categories?: string[];
    entities?: Array<{
      name: string;
      type: string;
      sentiment?: number;
    }>;
    customAnalytics?: Record<string, any>;
  };
}

export default function ContentDialog({
  open,
  onClose,
  content,
  onSave,
}: ContentDialogProps) {
  const { teams, user } = useAuth();
  const currentTeam = teams[0];

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    type: 'article',
    content: '',
    url: '',
    metadata: {
      source: '',
      language: 'en',
      tags: [],
      customFields: {},
    },
    analysis: {
      sentiment: undefined,
      keywords: [],
      categories: [],
      entities: [],
      customAnalytics: {},
    },
  });

  useEffect(() => {
    if (content) {
      setFormData({
        title: content.title,
        description: content.description || '',
        type: content.type,
        content: content.content,
        url: content.url,
        metadata: {
          source: content.metadata.source,
          language: content.metadata.language,
          tags: content.metadata.tags,
          customFields: content.metadata.customFields,
        },
        analysis: {
          sentiment: content.analysis.sentiment,
          keywords: content.analysis.keywords || [],
          categories: content.analysis.categories || [],
          entities: content.analysis.entities || [],
          customAnalytics: content.analysis.customAnalytics || {},
        },
      });
    }
  }, [content]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMetadataChange = (field: keyof typeof formData.metadata) => (
    _event: React.SyntheticEvent,
    newValue: string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [field]: newValue,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTeam || !user) return;

    try {
      if (content) {
        await updateContent(content.id, {
          ...formData,
          teamId: currentTeam.id,
          organizationId: currentTeam.organizationId,
          updatedAt: new Date().toISOString(),
        });
      } else {
        await createContent({
          ...formData,
          teamId: currentTeam.id,
          organizationId: currentTeam.organizationId,
          status: 'pending',
          createdBy: user.uid,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        className: 'dark:bg-gray-800'
      }}
    >
      <DialogTitle className="dark:text-white">
        {content ? 'Edit Content' : 'Create New Content'}
      </DialogTitle>
      <DialogContent>
        <Box component="form" noValidate className="space-y-4 mt-4">
          <TextField
            fullWidth
            label="Title"
            value={formData.title}
            onChange={handleTextChange}
            name="title"
            className="dark:text-white"
            InputLabelProps={{
              className: 'dark:text-gray-300'
            }}
            InputProps={{
              className: 'dark:text-white dark:bg-gray-700 dark:border-gray-600'
            }}
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleTextChange}
            name="description"
            className="dark:text-white"
            InputLabelProps={{
              className: 'dark:text-gray-300'
            }}
            InputProps={{
              className: 'dark:text-white dark:bg-gray-700 dark:border-gray-600'
            }}
          />
          <FormControl fullWidth>
            <InputLabel className="dark:text-gray-300">Type</InputLabel>
            <Select
              value={formData.type}
              onChange={handleSelectChange}
              name="type"
              className="dark:text-white dark:bg-gray-700"
            >
              <MenuItem value="article" className="dark:text-white dark:hover:bg-gray-600">Article</MenuItem>
              <MenuItem value="social_post" className="dark:text-white dark:hover:bg-gray-600">Social Post</MenuItem>
              <MenuItem value="video" className="dark:text-white dark:hover:bg-gray-600">Video</MenuItem>
              <MenuItem value="image" className="dark:text-white dark:hover:bg-gray-600">Image</MenuItem>
              <MenuItem value="document" className="dark:text-white dark:hover:bg-gray-600">Document</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Content"
            multiline
            rows={6}
            value={formData.content}
            onChange={handleTextChange}
            name="content"
            className="dark:text-white"
            InputLabelProps={{
              className: 'dark:text-gray-300'
            }}
            InputProps={{
              className: 'dark:text-white dark:bg-gray-700 dark:border-gray-600'
            }}
          />
          <TextField
            fullWidth
            label="URL (optional)"
            value={formData.url}
            onChange={handleTextChange}
            name="url"
            className="dark:text-white"
            InputLabelProps={{
              className: 'dark:text-gray-300'
            }}
            InputProps={{
              className: 'dark:text-white dark:bg-gray-700 dark:border-gray-600'
            }}
          />
          <FormControl fullWidth>
            <InputLabel className="dark:text-gray-300">Language</InputLabel>
            <Select
              value={formData.metadata.language}
              onChange={handleSelectChange}
              name="metadata.language"
              className="dark:text-white dark:bg-gray-700"
            >
              <MenuItem value="en" className="dark:text-white dark:hover:bg-gray-600">English</MenuItem>
              <MenuItem value="es" className="dark:text-white dark:hover:bg-gray-600">Spanish</MenuItem>
              <MenuItem value="fr" className="dark:text-white dark:hover:bg-gray-600">French</MenuItem>
            </Select>
          </FormControl>
          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={formData.metadata.tags}
            onChange={handleMetadataChange('tags')}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option}
                  label={option}
                  className="dark:bg-gray-700 dark:text-white"
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tags"
                className="dark:text-white"
                InputLabelProps={{
                  className: 'dark:text-gray-300'
                }}
                InputProps={{
                  ...params.InputProps,
                  className: 'dark:text-white dark:bg-gray-700 dark:border-gray-600'
                }}
              />
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions className="dark:bg-gray-800 dark:border-t dark:border-gray-700">
        <Button onClick={onClose} className="dark:text-gray-300 dark:hover:bg-gray-700">
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          className="dark:bg-primary-500 dark:hover:bg-primary-600"
        >
          {content ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
