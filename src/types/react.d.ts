import 'react'

declare module 'react' {
    function useActionState<State>(
        action: (state: State) => Promise<State>,
        initialState: State,
        permalink?: string
    ): [state: State, dispatch: () => void]

    function useActionState<State, Payload>(
        action: (state: State, payload: Payload) => Promise<State>,
        initialState: State,
        permalink?: string
    ): [state: State, dispatch: (payload: Payload) => void]
} 