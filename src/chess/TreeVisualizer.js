import { useState } from "react";
import { Chessboard } from "react-chessboard";

export default function TreeVisualizer({positionTree, initialPosition, head=false}){

    let totalCalls = 0;
    totalCalls++;

    const [showChildren, setShowChildren] = useState(false);
    let positionFEN = initialPosition[0]
    let positionMove = initialPosition[1]
    let positionValue = initialPosition[2]
    let positionAlpha = initialPosition[3]
    let positionBeta = initialPosition[4]

    const children = positionTree[positionFEN]
    const hasChildren = positionTree[positionFEN]

    function OnClickShowChildren(){
        setShowChildren(!showChildren)
    }

    if (positionTree == {}){
        return (
            <div></div>
        )
    }

    return (
        <div>
        { positionFEN ?
            <div className="tree-node" id={"node" + totalCalls}>
                {/* <pre id={"pre" + initialPosition} style={showChildren ? {color: "yellow"} : null}>{positionFEN} </pre> */}
                <div className="tiny-board">
                    <Chessboard 
                        position={positionFEN} 
                        boardWidth="100"
                        customDarkSquareStyle={{ backgroundColor: "#8BAFC7" }}
                        customLightSquareStyle={{ backgroundColor: "#FFFFFF" }}
                    />
                </div>
                <div className="position-info">
                    <p>{head ? "Best " : ""}Move: {positionMove}</p>
                    <p>Evaluation: {Math.round(positionValue)}</p>
                {/* <p>ALPHA: {positionAlpha}</p>
                <p>BETA: {positionBeta}</p> */}
                {hasChildren ? 
                    <button onClick={OnClickShowChildren}>{showChildren ? "Hide Continuations" : "Show Continuations"}</button>
                    :
                    null
                }
                </div>
                {(showChildren && children!=null)
                ? 
                <div className="viz-row">
                    {children.map(child =>
                    <div>
                        <TreeVisualizer positionTree={positionTree} initialPosition={child}/>
                    </div>
                    ) }
                </div>
                : 
                null}
                
            </div>
            :
            null
        }
        </div>
    )
}