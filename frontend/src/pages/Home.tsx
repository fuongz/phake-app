import { JSONEditor } from '../components/editors/json/json'
import { Button, Toaster, useId, useToastController } from '@fluentui/react-components'
import { ArrowLeft24Regular, BranchCompare24Regular, SaveSync20Regular } from '@fluentui/react-icons'
import { useMemo, useState } from 'react'
import { minifyJsonString, prettifyJsonString } from '../components/editors/json/utils/helper'
import { DiffEditor } from '@monaco-editor/react'
import { useSystemInfo } from '../hooks/useSystem'
import { useConfig } from '../hooks/useConfig'
import { useMutation } from '@tanstack/react-query'
import { BaseSkeleton, BaseToast, DatabaseStatus, SearchInput } from '../components'
import { useDebounce, useLocalStorage } from 'react-use'

// Offline message component
const OfflineMessage = () => {
  return <span className="text-red-700 italic">You're offline. Check your Database Connection.</span>
}

const Actions = ({ isChanged, tab, jsonValue, handleSave, setTab }: { isChanged: boolean; tab: string; jsonValue: string; setTab: any; handleSave: any }) => {
  return (
    <div className="flex ml-auto gap-4">
      <Button disabled={!isChanged} appearance="primary" icon={tab !== 'editor' ? <ArrowLeft24Regular /> : <BranchCompare24Regular />} onClick={() => setTab(tab === 'diff' ? 'editor' : 'diff')}>
        {tab === 'editor' ? 'Changes' : 'Back to Editor'}
      </Button>

      <Button disabled={!jsonValue || !isChanged} appearance="primary" icon={<SaveSync20Regular />} onClick={handleSave}>
        Save
      </Button>
    </div>
  )
}

interface HomeProps {}
export default function Home({}: HomeProps) {
  const toasterId = useId('toaster')
  const [currentConfigData, setCurrentConfigData] = useState<any>(undefined)
  const [jsonNewValue, setJsonNewValue] = useState<string>('')
  const { dispatchToast } = useToastController(toasterId)
  const { isLoading, error, data: system } = useSystemInfo()
  const { get: getConfig, put: updateConfig } = useConfig()
  const [tab, setTab] = useState('editor')
  const [value, setValue] = useLocalStorage('hiip.devtools.home_page_data', '')
  const cachedValue = useMemo(() => {
    return value || ''
  }, [value])
  const [jsonValue, setJsonValue] = useState<string>(cachedValue || '')

  const editorComponent = {
    editor: <JSONEditor height={'90.207%'} defaultValue={jsonValue} onChange={(value) => setJsonNewValue(value)} />,
    diff: (
      <div className="h-screen">
        <DiffEditor height={'90.207%'} language="json" original={prettifyJsonString(jsonValue)} modified={prettifyJsonString(jsonNewValue)} />
      </div>
    ),
  }[tab]

  const [,] = useDebounce(
    () => {
      if (jsonNewValue && jsonNewValue !== '') {
        console.log('Cache updated!')
        setValue(jsonNewValue)
      }
    },
    1000,
    [jsonNewValue]
  )

  const configMutation = useMutation({
    mutationKey: ['config'],
    mutationFn: (data: { id: string; description: string }) => updateConfig(data.id, data.description),
    onSuccess(data) {
      dispatchToast(<BaseToast title="Query executed successfully!" appearance="inverted" body={[`Name: ${data.id}`, `Queue ID: ${data.data.job_id}`]} />, { intent: 'success' })
    },
    onError(error: any, variables) {
      dispatchToast(<BaseToast title={error?.message} body={[variables?.id]} />, { intent: 'warning' })
    },
  })

  const isChanged = useMemo(() => {
    return minifyJsonString(jsonNewValue) !== minifyJsonString(jsonValue)
  }, [jsonNewValue, jsonValue])

  const handleSearch = async (value: string) => {
    try {
      if (!value) return
      const data = await getConfig(value)
      if (!data || !data.data) {
        throw new Error(data.message)
      }
      if (data?.status === 1 && data?.data) {
        setJsonValue(data?.data?.description)
        setCurrentConfigData(data?.data)
      }
    } catch (err: any) {
      console.log(err.message)
      dispatchToast(<BaseToast title={err.message} body={[value]} />, { intent: 'warning' })
    }
  }

  const handleSave = () => {
    const minifyJson = minifyJsonString(jsonNewValue)
    configMutation.mutate({
      id: currentConfigData.id,
      description: minifyJson,
    })
  }

  return (
    <>
      <div className="px-4 py-2 border-b flex w-full items-center gap-4">
        {!isLoading && system && system.data ? (
          <>
            <SearchInput onSubmit={(value) => handleSearch(value)} />
            <DatabaseStatus system={system} />
            {currentConfigData && <Actions isChanged={isChanged} tab={tab} setTab={setTab} jsonValue={jsonValue} handleSave={handleSave} />}
          </>
        ) : error || (!system?.data && !isLoading) ? (
          <OfflineMessage />
        ) : (
          <BaseSkeleton lines={1} />
        )}
      </div>
      {editorComponent}
      <Toaster toasterId={toasterId} />
    </>
  )
}
