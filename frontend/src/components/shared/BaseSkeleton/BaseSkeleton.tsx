import { Skeleton, SkeletonItem, useId } from '@fluentui/react-components'

interface BaseSkeletonProps {
  lines: number
}

const BaseSkeleton: React.FC<BaseSkeletonProps> = ({ lines }) => {
  const _lines = lines || 1
  const skeletonId = useId('skeleton')
  return <Skeleton className="w-full">{_lines && _lines > 0 && [...Array(_lines).keys()].map((_, index) => <SkeletonItem key={`${skeletonId}-${index}`} />)}</Skeleton>
}

export { BaseSkeleton }
