import { Action, action } from "easy-peasy"

interface Utterance {
    intermediate?: string
    confirmed?: string
    final?: string
}

export interface StoreModel {
    utterance: Utterance
    setUtterance: Action<StoreModel, Utterance>

    loading: boolean
    setLoading: Action<StoreModel, boolean>
}

const storeModel: StoreModel = {
    utterance: {},
    setUtterance: action((state, utterance) => { state.utterance = utterance }),

    loading: false,
    setLoading: action((state, loading) => { state.loading = loading })
}

export default storeModel