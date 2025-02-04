import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  SelectChangeEvent,
} from '@mui/material';
import { applyTemplate } from '../../api/content';
import { ContentItem, AnalysisTemplate } from '../../types';

interface AnalyzeDialogProps {
  open: boolean;
  onClose: () => void;
  content: ContentItem | null;
  templates: AnalysisTemplate[];
  onAnalyze: () => void;
}

export default function AnalyzeDialog({
  open,
  onClose,
  content,
  templates,
  onAnalyze,
}: AnalyzeDialogProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content || !selectedTemplate) return;

    try {
      await applyTemplate(selectedTemplate, content.id);
      onAnalyze();
      onClose();
    } catch (error) {
      console.error('Error analyzing content:', error);
    }
  };

  const handleTemplateChange = (event: SelectChangeEvent<string>) => {
    setSelectedTemplate(event.target.value);
  };

  const getTemplateDescription = () => {
    const template = templates.find((t) => t.id === selectedTemplate);
    return template?.description || '';
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        className: 'dark:bg-gray-800'
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle className="dark:text-white">
          Analyze Content
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Typography variant="body1" className="dark:text-white">
              Select an analysis template to apply to "{content?.title}"
            </Typography>

            <FormControl fullWidth>
              <InputLabel className="dark:text-gray-300">Template</InputLabel>
              <Select
                value={selectedTemplate}
                onChange={handleTemplateChange}
                label="Template"
                required
                className="dark:text-white dark:bg-gray-700"
                MenuProps={{
                  PaperProps: {
                    className: 'dark:bg-gray-700'
                  }
                }}
              >
                {templates.map((template) => (
                  <MenuItem 
                    key={template.id} 
                    value={template.id}
                    className="dark:text-white dark:hover:bg-gray-600"
                  >
                    {template.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedTemplate && (
              <Typography variant="body2" className="dark:text-gray-400">
                {getTemplateDescription()}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions className="dark:bg-gray-800 dark:border-t dark:border-gray-700">
          <Button 
            onClick={onClose}
            className="dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!selectedTemplate}
            className="dark:bg-primary-500 dark:hover:bg-primary-600 disabled:dark:bg-gray-600"
          >
            Analyze
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
