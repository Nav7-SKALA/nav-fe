import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { NaviLogo } from '../../assets/common'
import { IoMdPricetag} from 'react-icons/io'
import { BiSolidLock } from 'react-icons/bi'
import { HiMail } from 'react-icons/hi'
import { FaCircleUser, FaVenusMars, FaHeart} from 'react-icons/fa6'
import { FaCheckCircle, FaTimesCircle} from 'react-icons/fa'
import Select from 'react-select'
import { login } from '../../api/login';
import { signup, duplicate_Email, duplicate_Id, make_code } from '../../api/signup';
import CodeVerificationModal from '../modal/signup/CodeVerificationModal'
import { verify } from 'crypto'

interface OptionType{
    value:string
    label:string
}
const genderList:OptionType[] = [
    { value: 'MALE', label: '남성' },
    { value: 'FEMALE', label: '여성' },
  ]
type PageType = 'login' | 'signup';
interface CommonFormProps {
    pageType: PageType
  }


  interface InputItem {
    type: string;
    placeholder: string;
    icon?: React.ReactNode;
    onChange: (value: string) => void;
    value: string;
    isCheckable?: boolean;
    checkType?: 'userId' | 'email';
    onCheck?: (available: boolean) => void; 
    isPasswordMatch?: boolean | null;
  }
  
  const InputContainer = ({ type, placeholder, icon, onChange, value, isCheckable, checkType, onCheck, isPasswordMatch }: InputItem)=> {
    const [checking, setChecking] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [emailForVerification, setEmailForVerification] = useState<string | null>(null);
  
    const handleCheckDuplicate = async () => {
      if (!checkType || !value) {
        alert('값을 입력해주세요.')
        return;
      }  
      setChecking(true);
      try {
        let available;
        if (checkType === 'userId') {
          const response = await duplicate_Id(value);
          available = response.isSuccess;          
        } else {
          const response = await duplicate_Email(value);
          available = response.isSuccess;
        }
  
        if (available) {
          if (checkType === 'email') {
            // 이메일 사용 가능 시 모달 열기
            setEmailForVerification(value);
            const response = await make_code(value);
            if(response.isSuccess){
              setIsModalOpen(true);
            }
            else
            {
              alert('코드 생성 중 오류가 발생했습니다.');
            }
          } else {
            alert('아이디 사용 가능합니다.');
            setIsConfirmed(true);
            onCheck?.(true);
          }
        } else {
          alert(`${checkType === 'userId' ? '아이디' : '이메일'}가 이미 사용 중입니다.`);
          setIsConfirmed(false);
          onCheck?.(false);
        }
      } catch (err) {
        alert('검사 중 오류가 발생했습니다.');
        console.error(err);
      } finally {
        setChecking(false);
      }
    };
  
    const handleEmailVerificationSuccess = () => {
      setIsConfirmed(true);
      onCheck?.(true);
      setIsModalOpen(false);
    };
  
    return (
      <>
        {placeholder === '성별을 선택하세요' ? (
          <InputWrapper>
            {icon}
            <StyledSelect
              options={genderList}
              placeholder={placeholder}
              onChange={(option) => onChange((option as OptionType).value)}
            />
          </InputWrapper>
        ) : (
          <InputWrapper>
            {icon}
            <Input
              required
              type={type}
              placeholder={placeholder}
              onChange={(e) => {
                onChange(e.target.value);
                setIsConfirmed(false);
                onCheck?.(false);
              }}
              value={value}
            />
            {/* 비밀번호 확인 시 일치 여부 아이콘 표시 */}
            {placeholder === '비밀번호를 확인하세요' && isPasswordMatch !== null && (
              isPasswordMatch ? (
                <FaCheckCircle size={20} color="green" style={{ marginLeft: '0.3rem' }} />
              ) : (
                <FaTimesCircle size={20} color="red" style={{ marginLeft: '0.3rem' }} />
              )
            )}

            {isCheckable && checkType && (
              <CheckButton type="button" onClick={handleCheckDuplicate} 
              disabled={
                checking ||
                (checkType === 'email' && isConfirmed) || // 이메일 인증 완료 시 비활성화
                (checkType === 'userId' && isConfirmed)   // 아이디 중복 확인 완료 시 비활성화
              }>
                {checking
                  ? '확인 중...'
                  : isConfirmed
                  ? checkType === 'email'
                    ? '인증완료'
                    : '확인완료'
                  : checkType === 'email'
                  ? '인증하기'
                  : '중복검사'}
              </CheckButton>
            )}
          </InputWrapper>
        )}
  
        {/* 이메일 인증 모달 */}
        {checkType === 'email' && isModalOpen && emailForVerification && (
          <CodeVerificationModal
            email={emailForVerification}
            onSuccess={handleEmailVerificationSuccess}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </>
    );
  }
  
  

  const CommonForm = ({ pageType }: CommonFormProps) => {
    const navigate = useNavigate()
    const [userId, setUserId] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [gender, setGender] = useState('')
    const [name, setName] = useState('')
    const [isUserIdAvailable, setIsUserIdAvailable] = useState(false)
    const [isEmailAvailable, setIsEmailAvailable] = useState(false)
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [isPasswordMatch, setIsPasswordMatch] = useState<boolean | null>(null);

    const verifyPassword = (value: string) => {
      setPasswordConfirm(value);
      setIsPasswordMatch(value === password);
    };

  
    const validateForm = () => {
      if (!userId || !password || !email || !gender || !name) {
        alert('모든 항목을 입력해주세요.')
        return false
      }
      if (!isUserIdAvailable) {
        alert('아이디 중복 확인을 해주세요.')
        return false
      }
      if (!isEmailAvailable) {
        alert('이메일 중복 확인을 해주세요.')
        return false
      }
      if (isPasswordMatch === false) {
        alert('비밀번호가 일치하지 않습니다.');
        return false;
      }
      return true
    }
  
    const handleSignUp = async () => {
      if (!validateForm()) return
      try
      {
        const response = await signup(userId, password, email, name, gender)
          if (response.isSuccess) {
            alert('회원가입이 완료되었습니다.')
            setUserId('')
            setPassword('')
            setEmail('')
            setGender('')
            setName('')
            navigate('/login')
          } else {
            alert('회원가입에 실패했습니다. 다시 시도해주세요.')
          }
      }
      catch(err){
        console.error('회원가입 오류:', err)
        alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.')
      }
      }
  
    const handleLogin = async () => {
      try {
        const response = await login(userId, password)
        alert(`로그인 성공! 사용자 이름: ${response.loginId || 'N/A'}`)
        navigate('/main')
      } catch (error: any) {
        alert('로그인 실패: ' + (error.response?.message || error.message))
      }
    }
  
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (pageType === 'login') {
        handleLogin()
      } else {
        handleSignUp()
      }
    }
  
    // login input 정보  
    const loginInput:InputItem[] = [
      {
        type: 'text',
        placeholder: '아이디를 입력하세요',
        icon: <IoMdPricetag size={30} color="#5C5C5C" />,
        onChange: (value:string) => setUserId(value),
        value: userId,
      },
      {
        type: 'password',
        placeholder: '비밀번호를 입력하세요',
        icon: <BiSolidLock size={30} color="#5C5C5C" />,
        onChange: (value:string) => {
          setPassword(value);
          setIsPasswordMatch(value === passwordConfirm);
        },
        value: password, 
      },
    ]
    const signupInput: InputItem[] = [
      {
        type: 'text',
        placeholder: '성명을 입력하세요',
        icon: <FaCircleUser size={30} color="#5C5C5C" />,
        onChange: setName,
        value: name,
      },
      {
        type: 'text',
        placeholder: '아이디를 입력하세요',
        icon: <IoMdPricetag size={30} color="#5C5C5C" />,
        onChange: (val) => {
          setUserId(val)
          setIsUserIdAvailable(false) // 값 변경 시 중복 확인 다시 하도록
        },
        value: userId,
        isCheckable: true,
        checkType: 'userId',
        onCheck: setIsUserIdAvailable,
      },
      {
        type: 'email',
        placeholder: '이메일을 입력하세요',
        icon: <HiMail size={30} color="#5C5C5C" />,
        onChange: (val) => {
          setEmail(val)
          setIsEmailAvailable(false)
        },
        value: email,
        isCheckable: true,
        checkType: 'email',
        onCheck: setIsEmailAvailable,
      },
      {
        type: 'password',
        placeholder: '비밀번호를 입력하세요',
        icon: <BiSolidLock size={30} color="#5C5C5C" />,
        onChange: setPassword,
        value: password,
      },
      {
        type: 'password',
        placeholder: '비밀번호를 확인하세요',
        icon: <BiSolidLock size={30} color="#5C5C5C" />,
        onChange: verifyPassword,
        value: passwordConfirm,
        isPasswordMatch: isPasswordMatch,
      },
      {
        type: 'text',
        placeholder: '성별을 선택하세요',
        icon: <FaHeart size={30} color="#5C5C5C" />,
        onChange: setGender,
        value: gender,
      },
    ]
   

  return (
    <FormWrapper>
      {/* 로그인/회원가입  */}
      <H1>{pageType === 'login' ? 'Login' : 'SignUp'} Page</H1>
      <NaviLogo />
      <InfoText>
        Navi에 오신 걸 환영합니다. {pageType === 'login' ? '로그인' : '회원'}{' '}
        정보를 입력하세요
      </InfoText>
      {/* 로그인/회원가입 폼 */}
      <Form onSubmit={handleSubmit}>
        {pageType === 'login'
          ? loginInput.map((input, index) => (
              <InputContainer
                key={index}
                type={input.type}
                placeholder={input.placeholder}
                icon={input.icon}
                onChange={input.onChange}
                value={input.value}
              />
            ))
          : signupInput.map((input, index) => (
              <InputContainer
              key={index}
              type={input.type}
              placeholder={input.placeholder}
              icon={input.icon}
              onChange={input.onChange}
              value={input.value}
              isCheckable={input.isCheckable} 
              checkType={input.checkType}
              isPasswordMatch={input.isPasswordMatch}
              onCheck={input.onCheck}
              />
            ))}
        <Button type="submit">
          {pageType === 'login' ? '로그인' : '회원가입'}
        </Button>
      </Form>

      {/* 추가 메뉴 */}
      <LoginMenu>
        <ForgotPassword>
          {pageType === 'login'
            ? '비밀번호를 잊으셨나요?'
            : '* 모든 항목은 필수 입력 사항입니다'}
        </ForgotPassword>
        <SignUp
          onClick={() => navigate(pageType === 'login' ? '/signup' : '/login')}
        >
          {pageType === 'login' ? '회원가입' : '로그인하기'}
        </SignUp>
      </LoginMenu>
    </FormWrapper>
  )
}
export default CommonForm


const CheckButton = styled.button`
  margin-left: 0.5rem;
  padding: 0.5rem 0.7rem;
  background-color: #ff8b8b;
  color:white;
  border: none;
  border-radius: 4px;
  font-size: 0.7rem;
  cursor: pointer;
  white-space: nowrap;         // 줄바꿈 방지
  min-width: 4.5rem;           // 적절한 최소 너비 설정
  &:hover {
    background-color: #ff6b6b;
  }
  &:disabled {
    background-color:rgb(13, 133, 59);
    cursor: not-allowed;
  }
`


const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  width: 30vw;
  border-radius: 25px;
  padding: 3.5rem 2rem 2.5rem;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  min-width: 20rem;
  position: relative;
  z-index: 10 !important;
`
const H1 = styled.h1`
  display: none;
`
const InfoText = styled.p`
  font-size: 0.8rem;
  margin: 1.5rem 0 0.5rem;
`
const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`
const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  svg {
    margin: 0 0.5rem 0 0.3rem;
  }
`
const Input = styled.input`
  width: 100%;
  padding: 0.7rem 1rem;
  margin: 0.5rem 0;
  box-sizing: border-box;
  border: none;
  border-radius: 5px;
  background-color: #f1f1f1;
  &:focus {
    // border: -1px solid #ccc;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.2);
    background-color: #fff;
    outline: none;
  }
`

const StyledSelect = styled(Select)`
  font-size: 0.8rem;
  width: 100%;
  background-color: #f1f1f1 !important;
  margin-bottom: 0.3rem;
  border: none !important;
  border-radius: 5px;

  & > div {
    padding: 0.1rem 0.35rem;
    border: none !important;
    // box-shadow: none !important;
    background-color: #f1f1f1 !important;
  }
`

const Button = styled.button`
  width: 100%;
  margin: 0.5rem 0;
  padding: 0.8rem;
  background-color: #ff8b8b;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  &:hover {
    background-color: #ff6b6b;
  }
  &:focus {
    outline: none;
    box-shadow: inset 0 0 0 2px rgba(255, 0, 0, 0.5);
  }
`
const LoginMenu = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  justify-content: space-between;
  margin-top: 0.5rem;

  p {
    margin: 0;
    font-size: 0.8rem;
    font-weight: bold;
    color: #666;
    cursor: pointer;
  }
  p:nth-child(1) {
    color: #ff6b6b;
    &:hover {
      color: rgb(255, 85, 85);
    }
  }
  p:nth-child(2) {
    color: #417aff;
    &:hover {
      color: rgb(0, 102, 255);
    }
  }
`
const ForgotPassword = styled.p``
const SignUp = styled.p``
