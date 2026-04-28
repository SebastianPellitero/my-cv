import ImpressFlow from './ImpressFlow'

export default function FormalFlow({ onDone }: { onDone: () => void }) {
    return <ImpressFlow formal onDone={onDone} />
}
