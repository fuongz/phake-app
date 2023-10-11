import { Button, Input, useId } from '@fluentui/react-components'
import { DatabaseSearchRegular } from '@fluentui/react-icons'
import { useState } from 'react'

interface SearchInputProps {
  onSubmit: (value: string) => void
}

const SearchInput: React.FC<SearchInputProps> = ({ onSubmit }: SearchInputProps) => {
  const searchInputId = useId('search-input')
  const [searchValue, setSearchValue] = useState('')
  const [searchInputError, setSearchInputError] = useState<string | undefined>(undefined)

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

  const handleSearch = () => {
    if (!searchValue) return
    onSubmit?.(searchValue)
  }

  return (
    <>
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
    </>
  )
}

export { SearchInput }
