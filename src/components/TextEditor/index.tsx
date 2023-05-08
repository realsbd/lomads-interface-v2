import React, { useEffect, useRef } from 'react';
import { Typography, Box, TextField, FormControl, FormLabel, Chip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Editor } from '@tinymce/tinymce-react';

export default ({ labelChip, fullWidth, height, placeholder, value, onChange, label, ...props }: any) => {
    const editorRef = useRef(null);

    return (
        <FormControl fullWidth={fullWidth}>
            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                <FormLabel error={props.error} component="legend" sx={{ marginBottom: '10px' }}>{label}</FormLabel>
                {labelChip}
            </Box>
            <Editor
                apiKey='p0turvzgbtf8rr24txekw7sgjye6xunw2near38hwoohdg13'
                onInit={(evt: any, editor: any) => editorRef.current = editor}
                init={{
                    height,
                    placeholder,
                    menubar: false,
                    statusbar: false,
                    toolbar: false,
                    branding: false,
                    body_class: "mceBlackBody",
                    default_link_target: "_blank",
                    extended_valid_elements: "a[href|target=_blank]",
                    link_assume_external_targets: true,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                }}
                value={value}
                onEditorChange={(text) => { onChange(text) }}
            />
        </FormControl>
    )
}