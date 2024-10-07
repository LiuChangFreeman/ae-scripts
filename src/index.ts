import "./init"
import { toArray } from "./lib/collection"

function replaceWords() {
    const project = app.project
    const compName = NX.get("comp") as string || "main"
    const stretch = NX.get("stretch") as number || 100
    const items = toArray<ItemCollection, Item>(project.items)
    const comp = items.find((item) => item instanceof CompItem && item.name == compName)
    if (comp !== undefined) {
        const item = comp as CompItem
        const layers = toArray<LayerCollection, AVLayer>(item.layers)
        const textLayers = ["text", "text_main", "text_sub"];
        for (const layer of layers) {
            layer.stretch = stretch
            const layerName = layer.name
            if (textLayers.indexOf(layerName) !== -1) {
                const text = NX.get(layerName) as string || ""
                const layerText = layer as TextLayer
                const textProp = layerText.property("Source Text") as Property
                textProp.setValue(new TextDocument(text))
            }
        }
    }
}

function renderByNx() {
    const project = app.project
    const compName = NX.get("comp") as string || "main"
    const items = toArray<ItemCollection, Item>(project.items)
    const comp = items.find((item) => item instanceof CompItem && item.name == compName)
    if (comp !== undefined) {
        const renderQueue = project.renderQueue
        const renderQueueItems = toArray<RQItemCollection, RenderQueueItem>(renderQueue.items)
        for (const item of renderQueueItems) {
            item.remove()
        }
        const renderQueueItem = renderQueue.items.add(comp as CompItem)
        const start = NX.get("start") as number
        const duration = NX.get("duration") as number
        renderQueueItem.timeSpanStart = start
        renderQueueItem.timeSpanDuration = duration
        const outputPath = NX.get("output") as string
        const outputModule = renderQueueItem.outputModule(1)
        const settings = {
            "Output File Info": {
                "Full Flat Path": outputPath
            }
        };
        outputModule.setSettings(settings);
        renderQueue.render()
    }

}

replaceWords()
renderByNx()