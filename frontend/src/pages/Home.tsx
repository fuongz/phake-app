import { JSONEditor } from '../components/editors/json/json'
import { Button, Input, useId } from '@fluentui/react-components'
import { DatabaseSearchRegular } from '@fluentui/react-icons'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

interface HomeProps {}

export default function Home(props: HomeProps) {
  const searchInputId = useId('search-input')
  const [searchValue, setSearchValue] = useState('')
  const [searchInputError, setSearchInputError] = useState<string | undefined>(undefined)
  const [jsonValue, setJsonValue] = useState<string>('')

  const { isLoading, error, data } = useQuery({
    queryKey: ['systemInfo'],
    queryFn: () => fetch('http://localhost:3001/info').then((res) => res.json()),
  })

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
      const res = await fetch(`http://localhost:3001/config/${searchValue}`)
      const data = await res.json()
      if (data?.status === 1 && data?.data) {
        setJsonValue(data?.data?.description)
      }
    } catch (err: any) {
      console.log(err)
    }
  }

  return (
    <>
      <div className="px-4 py-2 border-b flex items-center gap-4">
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

        {data && (
          <p className="text-zinc-400 text-xs border-l pl-4">
            <span className="font-semibold text-zinc-600">Connected: </span>
            <span>mysql://</span>
            <span>{data?.data.database.user}/***@</span>
            <span>{data?.data.database.host}/</span>
            <span>{data?.data.database.name}</span>
          </p>
        )}
      </div>
      <JSONEditor defaultValue={jsonValue} />
    </>
  )
}
