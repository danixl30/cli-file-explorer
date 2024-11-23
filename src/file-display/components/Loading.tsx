import React, { ReactNode } from 'react'

type LoadingProps = {
	isloading: boolean
	children: ReactNode | ReactNode[]
	fallback: ReactNode | ReactNode[]
}

export const Loading = (props: LoadingProps) => {
	return <>{props.isloading ? props.fallback : props.children}</>
}
