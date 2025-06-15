import React from 'react'

const LogoutAlert = ({ onLogout }) => {
  return (
    <div>
        <p className='text-sm mb-6'>Are you sure you want to logout?</p>
        <div className='flex justify-end'>
            <button className='bg-[#9810FA] hover:bg-[#8609e0] text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out' type='button' onClick={onLogout}>
                Logout
            </button>
        </div>
    </div>
  )
}

export default LogoutAlert 