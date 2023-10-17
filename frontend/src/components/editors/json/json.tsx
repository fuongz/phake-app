import { Toolbar, ToolbarButton } from '@fluentui/react-components'
import { ArrowMinimize24Regular, Code24Regular, ArrowDownload24Regular } from '@fluentui/react-icons'
import { Editor, OnValidate } from '@monaco-editor/react'
import * as Monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { useCallback, useEffect, useRef, useState } from 'react'
import { downloadJsonFile, minifyJsonString } from './utils/helper'
import {} from '@fluentui/react-components'

interface RefObject extends Monaco.editor.ICodeEditor {
  _domElement?: HTMLElement
}

interface JSONEditorProp {
  readonly?: boolean
  height?: number | string
  defaultValue?: string | undefined
  onChange?: (value: any) => void
}

export const JSONEditor: React.FC<JSONEditorProp> = ({ readonly, height, onChange, defaultValue }): JSX.Element => {
  const editorRef = useRef<RefObject | null>(null)

  const [hasChanged, setHasChanged] = useState<boolean>(false)
  const [hasDefaultValue, setHasDefaultValue] = useState<boolean>(false)
  const [isValidJson, setIsValidJson] = useState(true)
  const [errors, setErrors] = useState<Array<string>>([])

  const handleEditorDidMount = (editor: any) => {
    setHasDefaultValue(true)
    editorRef.current = editor
  }

  const handleEditorValidation: OnValidate = useCallback((markers) => {
    const errorMessages = markers.map(({ startLineNumber, message }) => `line ${startLineNumber}: ${message}`)
    const hasContent = editorRef.current?.getValue()
    const hasError = errorMessages.length > 0

    setIsValidJson(!!hasContent && !hasError)
    setErrors(errorMessages)
  }, [])

  const handleEditorChange = useCallback(
    (value: any) => {
      setHasDefaultValue(false)
      onChange && onChange(value)
    },
    [onChange]
  )

  const handleOnChangeDefaultValue = useCallback(() => {
    const editor = editorRef.current
    if (!editor) return
    editor.setValue(defaultValue || '')
    defaultValue && editor.getAction('editor.action.formatDocument')?.run()
  }, [defaultValue])

  const handleToolbarAction = (action: 'pretty' | 'minify' | 'download') => {
    const editor = editorRef.current
    if (!editor) return
    const currentValue = editor.getValue()
    switch (action) {
      case 'pretty':
        editorRef.current?.getAction('editor.action.formatDocument')?.run()
        break
      case 'minify':
        editor.setValue(minifyJsonString(currentValue))
        break
      case 'download':
        downloadJsonFile(currentValue)
      default:
        break
    }
  }

  // useEffect Zone
  useEffect(() => {
    defaultValue && handleOnChangeDefaultValue()
  }, [defaultValue])

  return (
    <div className="h-screen">
      <div className="border-b">
        <Toolbar aria-label="Default">
          <ToolbarButton
            disabled={!isValidJson || (!editorRef.current?.getValue() && !hasDefaultValue)}
            aria-label="Download"
            icon={<ArrowDownload24Regular />}
            onClick={() => handleToolbarAction('download')}
          >
            Download
          </ToolbarButton>

          <ToolbarButton disabled={!isValidJson || !editorRef.current?.getValue()} aria-label="Minify" icon={<ArrowMinimize24Regular />} onClick={() => handleToolbarAction('minify')}>
            Minify
          </ToolbarButton>

          <ToolbarButton disabled={!isValidJson || !editorRef.current?.getValue()} aria-label="Pretty" icon={<Code24Regular />} onClick={() => handleToolbarAction('pretty')}>
            Pretty
          </ToolbarButton>
        </Toolbar>
      </div>

      <Editor
        language="json"
        options={{
          automaticLayout: true,
          autoClosingBrackets: 'always',
          autoClosingQuotes: 'always',
          formatOnPaste: true,
          formatOnType: true,
          fontFamily: 'Cascadia Code',
          fontLigatures: "'ss01', 'ss02', 'ss03', 'ss04', 'ss05', 'ss06', 'zero', 'onum'",
          fontSize: 14,
          scrollBeyondLastLine: false,
          readOnly: readonly === true,
          domReadOnly: readonly === true,
        }}
        onMount={handleEditorDidMount}
        height={height ? height : '93.8%'}
        defaultValue={typeof defaultValue !== 'undefined' ? defaultValue : ''}
        onValidate={handleEditorValidation}
        onChange={handleEditorChange}
      />

      {errors && errors.length > 0 && (
        <div className="error fixed bottom-0 w-full bg-red-500 text-white px-4 py-2 border-t z-10">
          {errors.map((message) => (
            <p key={`error-${message}`}>{message}</p>
          ))}
        </div>
      )}
    </div>
  )
}
