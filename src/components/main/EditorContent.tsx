'use client';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    ClassicEditor,
    Essentials,
    Paragraph,
    Bold,
    Italic,
    Link,
    Image,
    ImageUpload,
    ImageToolbar,
    ImageCaption,
    ImageStyle,
    ImageResize,
    FileRepository,
    Heading,
    List,
    BlockQuote,
    MediaEmbed,
    Undo,
    ImageInsert,
    PendingActions
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';
import { uploadImageAction } from '@/actions/cloudinary.actions';

function CustomUploadAdapterPlugin(editor: any) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
    return {
      upload: async () => {
        const file = await loader.file;
        const formData = new FormData();
        formData.append('file', file);
        
        try {
          const res = await uploadImageAction(formData);
          if (res.url) {
            return { default: res.url };
          } else {
            throw new Error(res.error || 'Upload failed');
          }
        } catch (error) {
          console.error("Upload Error:", error);
          throw error;
        }
      },
      abort: () => {}
    };
  };
}

interface EditorContentProps {
  content: string;
  onChange: (content: string) => void;
  onReady?: (editor: any) => void;
}

export default function EditorContent({ content, onChange, onReady }: EditorContentProps) {
  return (
    <div className="ckeditor-wrapper">
      <CKEditor
        editor={ClassicEditor}
        config={{
          licenseKey: 'GPL',
          plugins: [
            Essentials, Paragraph, Bold, Italic, Link,
            Image, ImageUpload, ImageToolbar, ImageCaption, ImageStyle, ImageResize, ImageInsert,
            FileRepository, Heading, List, BlockQuote, MediaEmbed, Undo, PendingActions,
            CustomUploadAdapterPlugin
          ],
          toolbar: [
            'heading', '|',
            'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|',
            'insertImage', 'mediaEmbed', 'undo', 'redo'
          ],
          image: {
            toolbar: [
              'imageStyle:inline',
              'imageStyle:block',
              'imageStyle:side',
              '|',
              'toggleImageCaption',
              'imageTextAlternative'
            ]
          }
        }}
        data={content}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
        onReady={(editor) => {
          if (onReady) onReady(editor);
        }}
      />
      <style jsx global>{`
        .ckeditor-wrapper {
          width: 100%;
        }
        .ckeditor-wrapper .ck-editor__editable_inline {
          min-height: 200px;
          color: black; /* Override for dark mode if necessary, ckeditor is usually black on white */
        }
      `}</style>
    </div>
  );
}
