import React, { useImperativeHandle, useRef, useState } from "react";
import { Box, Button, HStack } from "@chakra-ui/react";
import { PRIMARY_COLOR } from "@/constants";

export interface FileUploadProps {
    accept?: string
    multiple?: boolean
    uploadIcon?: React.JSX.Element
    uploadDropText?: string | React.JSX.Element
    uploadButtonText?: string | React.JSX.Element
    uploadPromptText?: string | React.JSX.Element
    uploadButtonAppendLeft?: React.JSX.Element
    uploadButtonAppendRight?: React.JSX.Element
    validator?: (file: File) => { success: boolean, reason?: any }
    onFile: (files: File[]) => void
    onValidateFail?: (file: File, reason: any) => void
}

const defaultProps = {
    accept: undefined,
    uploadIcon: undefined,
    uploadDropText: "拖动文件到这里或",
    uploadButtonText: "选择文件",
    uploadPromptText: undefined,
    uploadButtonAppendLeft: undefined,
    uploadButtonAppendRight: undefined,
    validator: undefined,
    onValidateFail: undefined,
    multiple: false,
};

const FileUpload: React.FC<FileUploadProps> = ({
    accept,
    multiple,
    uploadIcon,
    uploadDropText,
    uploadButtonText,
    uploadPromptText,
    uploadButtonAppendLeft,
    uploadButtonAppendRight,
    onFile,
    validator,
    onValidateFail,
}) => {
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    function handleFile(files: File[]) {
        for (let i = 0; i < files.length; i++) {
            const e = files[i];
            if (validator) {
                const result = validator(e);
                if (!result.success) {
                    if (onValidateFail) onValidateFail(e, result.reason);
                    return;
                }
            }
        }
        onFile(Array.prototype.map.call(files, (e) => e) as File[]); // 浅拷贝
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }

    const handleDrag = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files);
        }
    };

    const handleChange = (e: any) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files);
        }
    };

    const onButtonClick = () => {
        inputRef.current?.click();
    };

    return (
        <Box
            as="div"
            css={{
                height: "18rem",
                textAlign: "center",
                position: "relative",
                boxShadow: `0 0 0 max(100vh, 100vw) ${dragActive ? "#00000080" : "transparent"}`,
                transition: "box-shadow 0.2s",
                borderRadius: "1rem",
                zIndex: dragActive ? 999999 : "unset",
            }}
            onDragEnter={handleDrag}
        >
            <Box
                as="input"
                ref={inputRef}
                type="file"
                id="input-file-upload"
                accept={accept}
                multiple={multiple}
                onChange={handleChange}
                css={{ display: "none" }}
            />
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <Box
                as="label"
                css={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: "2px",
                    borderRadius: "1rem",
                    borderStyle: dragActive ? "solid" : "dashed",
                }}
                htmlFor="input-file-upload"
            >
                <Box>
                    <Box mb={4}>
                        {uploadDropText}
                    </Box>
                    <HStack justifyContent="center">
                        {uploadButtonAppendLeft}
                        <Button
                            colorScheme={PRIMARY_COLOR}
                            leftIcon={uploadIcon}
                            onClick={onButtonClick}
                        >
                            {uploadButtonText}
                        </Button>
                        {uploadButtonAppendRight}
                    </HStack>
                    {uploadPromptText && (
                        <Box mt={4} fontSize={14} opacity={0.7}>
                            {uploadPromptText}
                        </Box>
                    )}
                </Box>
            </Box>
            { dragActive && (
                <Box
                    css={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        borderRadius: "1rem",
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                    }}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                />
            ) }
        </Box>
    );
};

FileUpload.defaultProps = defaultProps;

export default FileUpload;
