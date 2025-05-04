import { createElement, Fragment, memo, ReactNode, ElementType } from "react"

type TPropsFor<T>  = {
  each: T[]
  children: (item: T, index: number) => ReactNode
  as?: ElementType
  role?: string
  className?: string
  id?: string
  ariaLabel?: string
  keyExtractor?: (item: T, index: number) => string | number
  props?: Record<string, unknown>
  itemWrapper?: (node: ReactNode, item: T, index: number) => ReactNode
  memoizeChildren?: boolean
}

export function For<T>(props: TPropsFor<T>) {
  const {
    each,
    children,
    as: Component = Fragment,
    role = 'list',
    className = '',
    id,
    ariaLabel,
    keyExtractor = (_, i) => i,
    props: restProps = {},
    itemWrapper,
    memoizeChildren = false,
  } = props

  const renderItem = (item: T, index: number) => {
    const key = keyExtractor(item, index)
    let node = children(item, index)
    if (itemWrapper) node = itemWrapper(node, item, index)
    return <Fragment key={key}>{node}</Fragment>
  }

  const MemoizedItem = memo((props: { item: T; index: number }) => 
    renderItem(props.item, props.index)
  )

  const mapped = each.map((item, index) => 
    memoizeChildren 
      ? <MemoizedItem key={keyExtractor(item, index)} item={item} index={index} />
      : renderItem(item, index)
  )

  return createElement(
    Component,
    {
      className,
      id,
      role,
      'aria-label': ariaLabel,
      ...restProps,
    },
    mapped
  )
}