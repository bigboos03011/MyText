import { useNavigate } from 'react-router-dom'
import { HistoryCollection } from '@/components/HistoryCollection'
import { useComfyStore } from '@/store/useComfyStore'

export default function HistoryPage() {
  const navigate = useNavigate()
  const { history, selectedAssetId, selectAsset, toggleFavoriteAsset, reuseHistoryAsset } = useComfyStore()

  return (
    <div className="pb-10">
      <HistoryCollection
        assets={history}
        selectedAssetId={selectedAssetId}
        onSelect={selectAsset}
        onToggleFavorite={toggleFavoriteAsset}
        onReuse={(assetId) => {
          reuseHistoryAsset(assetId)
          navigate('/')
        }}
      />
    </div>
  )
}
