import React, { useState, FormEvent } from 'react';
import app, { auth } from '../../firebaseConfig';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut} from 'firebase/auth';
import { Box, Button,  Flex,  FormControl,  FormLabel, Input, } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
  const [isSignIn, setIsSignedIn] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSignIn = async (event: FormEvent) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    const { email, password } = target.elements as any;
    const auth = getAuth(app);
    try {
       await signInWithEmailAndPassword(
        auth,
        email.value,
        password.value
      );
      alert("ログイン完了")
      navigate("/home")
    } catch (error) {
      alert(error);
    }
  };

  const handleSignOut = async (event: FormEvent) => {
    event.preventDefault();
    try {
        await signOut(auth);
    } catch (error) {
        console.log(error);
  };
 }

  const onClickRegister = () => {
    navigate("/register")
  };

  onAuthStateChanged(auth, (user) => {
  if(user) {
    setIsSignedIn(true);
  } else {
    setIsSignedIn(false);
  }
  })

  return (
    <Flex align="center" justify="center" height="100vh">
     <Box bg="gray.100" w="md" p={4} borderRadius="md" shadow="md" >
       <form onSubmit={handleSignIn}>
        <FormControl id="email" mb={4}>
            <FormLabel>メールアドレス:</FormLabel>
            <Input type="email" name="email" />
        </FormControl>
        <FormControl id="password" mb={4}>
            <FormLabel>パスワード:</FormLabel>
            <Input type="password" name="password" />
        </FormControl>
        <Button type="submit" value="Sign in" mb={5} w="full" bg="teal.400" _hover={{opacity:0.8}}>サインイン</Button>
      </form>
      <form onSubmit={handleSignOut}>
        <Button type="submit" value="Sign out" w="full" bg="teal.400" _hover={{opacity:0.8}}>サインアウト</Button>
      </form>
      <Button onClick={onClickRegister} bg="gray.300" mt={10}>会員登録はこちら</Button>
    </Box>
   </Flex>
  );
};
