import { JSONEditor } from '../components/editors/json/json'
import { Button, Input, Skeleton, SkeletonItem, Toast, ToastBody, ToastTitle, Toaster, useId, useToastController } from '@fluentui/react-components'
import { ArrowLeft24Regular, BranchCompare24Regular, DatabaseSearchRegular, SaveSync20Regular } from '@fluentui/react-icons'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { minifyJsonString, prettifyJsonString } from '../components/editors/json/utils/helper'
import { DiffEditor } from '@monaco-editor/react'

interface HomeProps {}

export default function Home(props: HomeProps) {
  const toasterId = useId('toaster')
  const searchInputId = useId('search-input')
  const [searchValue, setSearchValue] = useState('')
  const [searchInputError, setSearchInputError] = useState<string | undefined>(undefined)
  const [currentConfigData, setCurrentConfigData] = useState<any>(undefined)
  const [jsonValue, setJsonValue] = useState<string>('')
  const [jsonNewValue, setJsonNewValue] = useState<string>('')
  const { dispatchToast } = useToastController(toasterId)
  const [tab, setTab] = useState('editor')

  const { isLoading, data } = useQuery({
    queryKey: ['systemInfo'],
    queryFn: () => fetch('http://localhost:3002/v1/system-info').then((res) => res.json()),
  })

  const isChanged = useMemo(() => {
    return minifyJsonString(jsonNewValue) !== minifyJsonString(jsonValue)
  }, [jsonNewValue, jsonValue])

  const handleOnChangeSearchInput = (e: any) => {
    setSearchValue(e.target.value)
    if (e.target.value === '' || !e.target.value) {
      setSearchInputError('Please enter config name.')
    } else {
      setSearchInputError(undefined)
    }
  }

  const handleSearchInputKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleSearch = async () => {
    try {
      if (!searchValue) return
      const res = await fetch(`http://localhost:3002/v1/configs/${searchValue}`)
      const data = await res.json()
      if (!res.ok) {
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
          <ToastBody>{searchValue}</ToastBody>
        </Toast>,
        { intent: 'warning' }
      )
    }
  }

  const handleSave = async () => {
    try {
      const minifyJson = minifyJsonString(jsonNewValue)
      const res = await fetch(`http://localhost:3002/v1/configs/${currentConfigData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: minifyJson,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message)
      }
      if (data?.status === 1 && data?.data) {
        dispatchToast(
          <Toast>
            <ToastTitle>Query executed successfully!</ToastTitle>
            <ToastBody>{searchValue}</ToastBody>
          </Toast>,
          { intent: 'success' }
        )
      }
    } catch (err: any) {
      console.log(err.message)
      dispatchToast(
        <Toast>
          <ToastTitle>{err.message}</ToastTitle>
          <ToastBody>{searchValue}</ToastBody>
        </Toast>,
        { intent: 'warning' }
      )
    }
  }

  return (
    <>
      <div className="px-4 py-2 border-b flex w-full items-center gap-4">
        <Input
          onChange={handleOnChangeSearchInput}
          onKeyDown={handleSearchInputKeyDown}
          placeholder="Enter config name"
          appearance="filled-darker"
          className="w-1/3"
          contentBefore={<DatabaseSearchRegular />}
          id={searchInputId}
        />
        <Button icon={<DatabaseSearchRegular />} onClick={handleSearch}>
          Search
        </Button>

        <div className="pl-4 border-l">
          {!isLoading && data ? (
            <p className="text-zinc-400 text-xs">
              <span className="font-semibold text-zinc-600">Connected: </span>
              <span>mysql://</span>
              <span>{data?.data.database.user}/***@</span>
              <span>{data?.data.database.host}/</span>
              <span>{data?.data.database.name}</span>
            </p>
          ) : (
            <Skeleton>
              <SkeletonItem />
            </Skeleton>
          )}
        </div>

        {currentConfigData && (
          <div className="flex ml-auto gap-4">
            <Button disabled={!isChanged} appearance="primary" icon={tab !== 'editor' ? <ArrowLeft24Regular /> : <BranchCompare24Regular />} onClick={() => setTab(tab === 'diff' ? 'editor' : 'diff')}>
              {tab === 'editor' ? 'Changes' : 'Back to Editor'}
            </Button>

            <Button disabled={!searchValue || !jsonValue || !isChanged} appearance="primary" icon={<SaveSync20Regular />} onClick={handleSave}>
              Save
            </Button>
          </div>
        )}
      </div>

      {tab === 'editor' && <JSONEditor height={'90.207%'} defaultValue={jsonValue} onChange={(value) => setJsonNewValue(value)} />}
      {tab === 'diff' && (
        <div className="h-screen">
          <DiffEditor height={'90.207%'} language="json" original={prettifyJsonString(jsonValue)} modified={prettifyJsonString(jsonNewValue)} />
        </div>
      )}

      <Toaster toasterId={toasterId} />
    </>
  )
}
