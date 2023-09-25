import { ReactSketchCanvas } from 'react-sketch-canvas'
import { useEffect, useState } from 'react'

var img = new Image()
export default function Paint({ imgToEdit, canvasRef, className, pincel }) {
    const [alto, setAlto] = useState(500)
    const [ancho, setAncho] = useState(500)

    useEffect(() => {
        img.src = imgToEdit
        setAlto(img.height)
        setAncho(img.width)
    }, [imgToEdit])

    const styles = {
        backgroundImage: `url(${imgToEdit})`,
    }

    return (
        <>
            {img ? (
                <ReactSketchCanvas
                    ref={canvasRef}
                    style={styles}
                    width={ancho}
                    height={alto}
                    strokeWidth={pincel}
                    strokeColor="black"
                    canvasColor="transparent"
                    className={className}
                />
            ) : (
                <>No hay imagen, recarga</>
            )}
        </>
    )
}
