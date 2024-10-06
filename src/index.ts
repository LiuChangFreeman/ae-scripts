import "./init"
import { toArray } from "./lib/collection"



// a standard javascript array example:
function displayCompLayerNames() {
    const items = toArray<ItemCollection, Item>(app.project.items)
    const comp = items.find((item) => item instanceof CompItem)

    if (comp instanceof CompItem) {
        const layers = toArray<LayerCollection, Layer>(comp.layers)
        // writeLn(JSON.stringify({ time: layers[0].startTime }))
        // comp.layers.addText("fasfasfasf")
        for (const layer of layers) {
            // const scaleProperty = layer.scale //定义缩放
            // const time = 3.5
            // const scaleValue = scaleProperty.valueAtTime(time, false) //获取3.5秒的缩放值
            // writeLn(`${layer.name} scale at ${time}: ${scaleValue[0]}/${scaleValue[1]}`)
            app.beginUndoGroup("rotation")
            const rotationProperty = layer.rotation //定义旋转
            rotationProperty.setValueAtTime(0, 0)
            rotationProperty.setValueAtTime(1.5, 90)
            rotationProperty.setValueAtTime(3.0, 0)
            app.endUndoGroup()
        }
    }
}


function renderByNx() {
    const project = app.project

    const items = toArray<ItemCollection, Item>(project.items)
    const comp = items.find((item) => item instanceof CompItem && item.name == "main")
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


function changeLayerTime() {
    const project = app.project

    const items = toArray<ItemCollection, Item>(project.items)
    const comp = items.find((item) => item instanceof CompItem && item.name == "video")
    if (comp !== undefined) {
        const item = comp as CompItem
        const layer = item.layer(1) as AVLayer
        layer.startTime = 2.0
        layer.inPoint = 5.0
        layer.outPoint = 10.0
        const time = `time: ${layer.inPoint}-${layer.outPoint}-${layer.startTime}`
        writeLn(time)
    }
}

function replaceWords() {
    const project = app.project

    const items = toArray<ItemCollection, Item>(project.items)
    const comp = items.find((item) => item instanceof CompItem && item.name == "main")
    if (comp !== undefined) {
        const item = comp as CompItem
        const layers = toArray<LayerCollection, AVLayer>(item.layers)
        const textLayers = ["text", "text_main", "text_sub"];
        for (const layer of layers) {
            const stretch = NX.get("stretch") as number
            layer.stretch = stretch
            const name = layer.name
            if (textLayers.indexOf(name) !== -1) {
                const text = NX.get(name) as string
                const layerText = layer as TextLayer
                const textProp = layerText.property("Source Text") as Property
                textProp.setValue(new TextDocument(text))
            }
        }
    }
}


// displayCompLayerNames()
// renderByNx()
// changeLayerTime()
replaceWords()
renderByNx()