import styles from './imageTo64.module.css'
import { RiImageFill } from 'react-icons/ri'
import { useState } from 'react'

export default function ImageTo64({ setImg }) {
    const handleImageUpload = (event) => {
        const file = event.target.files[0]
        imgToB64(file)
    }
    const handleImageUploadLabel = (event) => {
        event.preventDefault()
        const file = event.dataTransfer.files[0]
        imgToB64(file)
    }

    const imgToB64 = (file) => {
        if (file) {
            const reader = new FileReader()

            reader.onload = (e) => {
                const base64Data = e.target.result
                setImg(base64Data)
            }

            reader.readAsDataURL(file)
        }
    }

    return (
        <>
            <label
                htmlFor="images"
                className={styles.dropContainer}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleImageUploadLabel}
            >
                <div className={styles.text}>
                    <RiImageFill />
                    <br />
                    <span>Suelta tus imagenes aqui</span>
                </div>
                o
                <input
                    type="file"
                    id="images"
                    accept="image/*"
                    className={styles.inputImage}
                    onChange={handleImageUpload}
                />
            </label>
        </>
    )
}
