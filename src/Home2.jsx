import Paint2 from './Paint2'
import ImageTo64 from './ImageTo64'
import { useRef, useState } from 'react'
import { saveAs } from 'file-saver'
import styles from './home2.module.css'
import Interfaz from './Interfaz.jpg'

let blob
export default function Home2() {
    const [imgToEdit, setImgToEdit] = useState('')
    const [mask, setMask] = useState('')
    const [url, setUrl] = useState('')
    const [promps, setPromps] = useState('')
    const [result, setResult] = useState([])
    const [pincel, setPincel] = useState(50)

    const canvas = useRef()
    function getMask() {
        canvas.current
            .exportImage('svg')
            .then((data) => {
                setMask(data)
                generateImg(data)
            })
            .catch((e) => {
                console.log(e)
            })
    }

    function generateImg(myMask) {
        alert('Generando imagen, esto puede tardar un tiempo')
        fetch(url + 'sdapi/v1/img2img', {
            method: 'POST',
            body: JSON.stringify({
                init_images: [imgToEdit + 'realistic, hd'],
                mask: myMask,
                prompt: promps,
                negative_prompt:
                    'hand, hands, face, head, foot, skin, naked, nude, nudity',
                steps: 25,
                seed: -1,
                cfg_scale: 7,
                sampler_name: 'DPM++ 2M Karras',
                batch_size: 4,
                denoising_strength: 0.75,
                inpainting_fill: 1, //Masked content
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                convertirBase64AImagen(data.images[0])
                alert('Imagen generada')
            })
            .catch((e) => {
                console.log(e)
                alert('Error al generar la imagen')
            })
    }

    function convertirBase64AImagen(base64String) {
        const byteCharacters = atob(base64String)
        const byteArray = new Uint8Array(byteCharacters.length)

        for (let i = 0; i < byteCharacters.length; i++) {
            byteArray[i] = byteCharacters.charCodeAt(i)
        }

        blob = new Blob([byteArray], { type: 'image/jpeg' })

        const reader = new FileReader()
        reader.onload = (e) => {
            setResult(e.target.result)
        }
        reader.readAsDataURL(blob)
    }

    function saveImage() {
        saveAs(blob, 'imagen.png')
    }

    return (
        <div className={styles.container}>
            <div>
                <img src={Interfaz} alt="" />
            </div>
            <input
                type="text"
                onChange={(e) => setUrl(e.target.value)}
                value={url}
                placeholder="Escribe tu url de la API"
                className={`${styles.url} + ${styles.input}`}
            />
            <br />
            <textarea
                type="text"
                value={promps}
                onChange={(e) => setPromps(e.target.value)}
                rows={5}
                cols={100}
                className={`${styles.input}`}
                placeholder='Escribe tus promps separados por comas (,), por ejemplo: "Camiseta roja con puntos azules, Blue jean con rotos en las rodillas"'
            />
            <br />

            {imgToEdit == '' ? (
                <ImageTo64 setImg={setImgToEdit} />
            ) : (
                <div>
                    <h2>Pintar:</h2>
                    <p>Pinta lo que necesites cambiar.</p>
                    <Paint2
                        imgToEdit={imgToEdit}
                        canvasRef={canvas}
                        className={styles.border}
                        pincel={pincel}
                    />
                    <button onClick={getMask} className={styles.button}>
                        Generar
                    </button>
                    <button onClick={saveImage} className={styles.button}>
                        Descargar imagen generada
                    </button>
                    <button
                        onClick={() => {
                            setImgToEdit('')
                            setMask('')
                            setResult('')
                        }}
                        className={styles.button}
                    >
                        Cambiar de imagen
                    </button>
                    <button
                        className={styles.button}
                        onClick={() => {
                            setPincel(pincel + 5)
                        }}
                    >
                        +
                    </button>
                    <button
                        className={styles.button}
                        onClick={() => {
                            setPincel(pincel - 5)
                        }}
                    >
                        -
                    </button>
                    <button
                        className={styles.button}
                        onClick={() => {
                            canvas.current.clearCanvas()
                        }}
                    >
                        Limpiar
                    </button>
                    <button
                        className={styles.button}
                        onClick={() => {
                            canvas.current.undo()
                        }}
                    >
                        Deshacer
                    </button>
                    <button
                        className={styles.button}
                        onClick={() => {
                            canvas.current.redo()
                        }}
                    >
                        Rehacer
                    </button>
                </div>
            )}

            {result != '' && (
                <>
                    <h2>Resultado: </h2>
                    <img
                        src={result}
                        className={`${styles.border}`}
                        alt="Imagen resultado"
                    />
                </>
            )}
        </div>
    )
}
