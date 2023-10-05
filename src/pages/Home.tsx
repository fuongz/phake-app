import { JSONEditor } from '../components/editors/json/json'

interface HomeProps {}

export default function Home(props: HomeProps) {
  return (
    <>
      <JSONEditor defaultValue={'{"a":1}'} />
    </>
  )
}
