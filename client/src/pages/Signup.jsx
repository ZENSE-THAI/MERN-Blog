import { React, useState } from 'react'
import {  Link , useNavigate} from 'react-router-dom'
import { FloatingLabel,Label,Button, Alert, Spinner} from 'flowbite-react'
import { HiInformationCircle } from "react-icons/hi";
import { OAuth } from '../component/OAuth';


export const Signup = () => {
  const [formData, setFormData] = useState({});
  const [errorMessage,setErrorMessage] = useState(null);
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({...formData,[e.target.id]:e.target.value.trim()})
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.username || !formData.email || !formData.password){
      return setErrorMessage('Please fill out all fields.')
    }
    
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success === false){
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if(res.ok){
        return navigate('/sign-in')
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
   <div className="min-h-screen mt-20">
    <div className="flex gap-5 p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center  ">
      {/* left */}
      <div className="flex-1 text-center md:text-start">
        <Link to='/' className='uppercase  font-bold dark:text-white text-4xl'>
        <span className=' px-2 py-1 bg-gradient-to-tr from-sky-500 to-indigo-500 rounded-lg text-white'>Zense</span>
        Blogs
        </Link>
        <p className='text-md mt-5'>
          This is MyBlog Project, You can Sign up with you email and password
          or with Google.
        </p>
      </div>
      {/* right */}
      <div className="flex-1 mt-5 ">
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <div>
            <Label value='Your Username'/>
            <FloatingLabel variant="outlined" label="Username" id='username' disabled={false} onChange={handleChange} autoComplete='true'/>
          </div>
          <div>
            <Label value='Your E-mail'/>
            <FloatingLabel variant="outlined" label="E-mail" id='email' disabled={false} onChange={handleChange} autoComplete='true'/>
          </div>
          <div>
            <Label value='Your Password'/>
            <FloatingLabel variant="outlined" type='password' label="Password" id='password' disabled={false} autoComplete="current-password" onChange={handleChange}/>
          </div>
          <Button gradientDuoTone="purpleToBlue" className='w-full' type='submit' disabled={loading}>
            {
              loading ? (
                <div className='flex items-center gap-2 justify-center'>
                  <Spinner size='md' />
                  <span>Loading...</span>
                </div>
              ) : 'Sign Up'
            }
          </Button>
          <OAuth/>
        </form>
        <div className="">
          <span>Have an account?</span>
          <Link to='/sign-in'className='text-blue-500 ml-2 '>
          Sign In
          </Link>
        </div>
        {
          errorMessage && (
            <Alert className='mt-5'  color="failure" icon={HiInformationCircle}>
              <span>{errorMessage}</span>
            </Alert>
          )
        }
      </div>
    </div>
   </div>
  )
}
