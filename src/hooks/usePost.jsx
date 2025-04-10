import { useEffect, useState, useRef, useCallback } from "react"

export const usePost = ({ 
    object = null, 
    url, 
    headers = {}, 
    immediate = false,
    onSuccess = null,
    onError = null
}) => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [controller, setController] = useState(null)
    
    const shouldFetch = useRef(immediate)
    
    const pendingObject = useRef(object)

    const executePost = useCallback(async (postObject = null) => {
        const objectToPost = postObject || object
        
        if (!url || !objectToPost) {
            return;
        }
        
        if (controller) {
            controller.abort()
        }
        
        const abortController = new AbortController()
        setController(abortController)
        
        setLoading(true)
        setError(null)
        
        try {
            const req = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...headers
                },
                body: JSON.stringify(objectToPost),
                signal: abortController.signal
            })

            // Manejo de respuesta no-JSON
            let responseData
            const contentType = req.headers.get("content-type")
            if (contentType && contentType.includes("application/json")) {
                responseData = await req.json()
            } else {
                responseData = await req.text()
            }

            if (!req.ok) {
                const errorData = {
                    status: req.status,
                    statusText: req.statusText,
                    data: responseData
                }
                setError(errorData)
                if (onError) onError(errorData)
                setLoading(false)
                return
            }
            
            setData(responseData)
            if (onSuccess) onSuccess(responseData)
            setLoading(false)
        } catch (error) {
            
            if (error.name === 'AbortError') {
                return
            }
            
            console.error('POST request failed:', error)
            setError(error)
            if (onError) onError(error)
            setLoading(false)
        }
    }, [url, object, headers, onSuccess, onError])
    

    const executeRequest = useCallback((newObject = null) => {
        if (newObject) {
            pendingObject.current = newObject
        }
        shouldFetch.current = true
        executePost(pendingObject.current)
    }, [executePost])
    

    const cancelRequest = useCallback(() => {
        if (controller) {
            controller.abort()
            setLoading(false)
        }
    }, [controller])
    
    const reset = useCallback(() => {
        setData(null)
        setError(null)
        setLoading(false)
        shouldFetch.current = false
    }, [])

    useEffect(() => {
        
        if (shouldFetch.current) {
            executePost()
        
            if (!immediate) {
                shouldFetch.current = false
            }
        }
        
        return () => {
            if (controller) {
                controller.abort()
            }
        }
    }, [url, object, headers, executePost, immediate])

    return {
        data,
        loading,
        error,
        execute: executeRequest,
        cancel: cancelRequest,
        reset
    }
}