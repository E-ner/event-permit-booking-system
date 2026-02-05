import React from 'react'
import api from '../app/utils/Axios'

const TestApi = () => {
    const handleTestApi = async () => {
    const res = await api.get('/')
    if (res) {
        console.log(res)
    }
    console.log("route miss function")
    }
    handleTestApi()
}

export default TestApi