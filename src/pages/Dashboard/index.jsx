import { Button } from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router';

export const Dashboard = () => {
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem('token');
        navigate('/auth/login');
    }

    return (
        <div>
            Página dashboard
            <Button onClick={logout}>Logout</Button>
        </div>
    )
}
