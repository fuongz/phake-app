import { Input, Label, makeStyles, shorthands, useId } from '@fluentui/react-components'
import { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { capitalizeFirstLetter } from '@/utils/index'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('4px'),
  },
  label: {
    fontWeight: 600,
  },
})

interface BaseInputControlProps {
  label: string
  name: string
  size?: 'medium' | 'small' | 'large' | undefined
  disabled?: boolean
  placeholder?: string
  type?: 'number' | 'search' | 'time' | 'text' | 'email' | 'password' | 'tel' | 'url' | 'date' | 'datetime-local' | 'month' | 'week' | undefined
}

const BaseInputControl: React.FC<BaseInputControlProps> = (props) => {
  const inputId = useId('input')
  const styles = useStyles()
  const {
    register,
    formState: { errors },
  } = useFormContext()
  const error: string | null = useMemo(() => {
    return errors[props.name] && errors[props.name]?.message ? capitalizeFirstLetter((errors[props.name]?.message as string) || '') : null
  }, [errors[props.name]])

  return (
    <div className={styles.root}>
      <Label htmlFor={inputId} className={styles.label} size={props.size} disabled={props.disabled}>
        {props.label}
      </Label>
      <Input id={inputId} {...props} appearance="filled-darker" {...register(props.name)} />
      {!!error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

export { BaseInputControl }
