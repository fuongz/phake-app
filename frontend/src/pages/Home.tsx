import { JSONEditor } from '../components/editors/json/json'
import { Button, Skeleton, SkeletonItem, Toast, ToastBody, ToastTitle, Toaster, useId, useToastController } from '@fluentui/react-components'
import { ArrowLeft24Regular, BranchCompare24Regular, SaveSync20Regular } from '@fluentui/react-icons'
import { useMemo, useState } from 'react'
import { minifyJsonString, prettifyJsonString } from '../components/editors/json/utils/helper'
import { DiffEditor } from '@monaco-editor/react'
import { useSystemInfo } from '../hooks/useSystem'
import { useConfig } from '../hooks/useConfig'
import { useMutation } from '@tanstack/react-query'
import { DatabaseStatus, SearchInput } from '../components'

interface HomeProps {}

export default function Home(props: HomeProps) {
  const toasterId = useId('toaster')
  const [currentConfigData, setCurrentConfigData] = useState<any>(undefined)
  const [jsonValue, setJsonValue] = useState<string>('')
  const [jsonNewValue, setJsonNewValue] = useState<string>('')
  const { dispatchToast } = useToastController(toasterId)
  const { isLoading, data: system } = useSystemInfo()
  const { get: getConfig, put: updateConfig } = useConfig()
  const [tab, setTab] = useState('editor')

  const TABS = {
    editor: <JSONEditor height={'90.207%'} defaultValue={jsonValue} onChange={(value) => setJsonNewValue(value)} />,
    diff: (
      <div className="h-screen">
        <DiffEditor height={'90.207%'} language="json" original={prettifyJsonString(jsonValue)} modified={prettifyJsonString(jsonNewValue)} />
      </div>
    ),
  }[tab]

  const mutation = useMutation({
    mutationKey: ['config'],
    mutationFn: (data: { id: string; description: string }) => updateConfig(data.id, data.description),
    onSuccess(data) {
      dispatchToast(
        <Toast appearance="inverted">
          <ToastTitle>Query executed successfully!</ToastTitle>
          <ToastBody>
            <p className="text-zinc-400 text-sm">Name: {data.id}</p>
            <p className="mt-1 text-zinc-400 text-sm">Queue ID: {data.data.job_id}</p>
          </ToastBody>
        </Toast>,
        { intent: 'success' }
      )
    },
    onError(error: any, variables) {
      dispatchToast(
        <Toast>
          <ToastTitle>{error?.message}</ToastTitle>
          <ToastBody>{variables?.id}</ToastBody>
        </Toast>,
        { intent: 'warning' }
      )
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
      dispatchToast(
        <Toast>
          <ToastTitle>{err.message}</ToastTitle>
          <ToastBody>{value}</ToastBody>
        </Toast>,
        { intent: 'warning' }
      )
    }
  }

  const handleSave = () => {
    const minifyJson = minifyJsonString(jsonNewValue)
    mutation.mutate({
      id: currentConfigData.id,
      description: minifyJson,
    })
  }

  return (
    <>
      <div className="px-4 py-2 border-b flex w-full items-center gap-4">
        {!isLoading && system ? (
          <>
            {system.data ? (
              <>
                <SearchInput onSubmit={(value) => handleSearch(value)} />
                <DatabaseStatus system={system} />

                {currentConfigData && (
                  <div className="flex ml-auto gap-4">
                    <Button
                      disabled={!isChanged}
                      appearance="primary"
                      icon={tab !== 'editor' ? <ArrowLeft24Regular /> : <BranchCompare24Regular />}
                      onClick={() => setTab(tab === 'diff' ? 'editor' : 'diff')}
                    >
                      {tab === 'editor' ? 'Changes' : 'Back to Editor'}
                    </Button>

                    <Button disabled={!jsonValue || !isChanged} appearance="primary" icon={<SaveSync20Regular />} onClick={handleSave}>
                      Save
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <span className="text-red-700 italic">You're offline. Check your Database Connection.</span>
            )}
          </>
        ) : (
          <Skeleton className="w-full">
            <SkeletonItem />
          </Skeleton>
        )}
      </div>

      {TABS}

      <Toaster toasterId={toasterId} />
    </>
  )
}
