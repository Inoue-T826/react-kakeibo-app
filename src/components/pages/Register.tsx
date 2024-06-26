import React, { useState, FormEvent } from 'react';
import app, { auth, db } from '../../firebaseConfig';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged} from 'firebase/auth';
import { Box, Button, Flex, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';

export const Register: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isSignIn, setIsSignedIn] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    const { email, password } = target.elements as any;
    const auth = getAuth(app);
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        email.value,
        password.value
      )
      .then((userCredential) => {
        const user = userCredential.user;
        return setDoc(doc(db, "users", user.uid), {
          email: user.email,
          uid: user.uid,
        });
      })
      .catch((error) => {
        console.error("Error creating user: ", error);
      });
      alert("登録完了")
      console.log("user", user);
      navigate("/")
    } catch (error) {
      alert(error);
    }
   }

  onAuthStateChanged(auth, (user) => {
  if(user) {
    setIsSignedIn(true);
  } else {
    setIsSignedIn(false);
  }
  })

  return (
  <Flex align="center" justify="center" height="100vh">
    <Box bg="gray.100" w="md" p={4} borderRadius="md" shadow="md">
      <form onSubmit={handleSubmit}>
      <FormControl id="email" mb={4}>
        <FormLabel>メールアドレス</FormLabel>
          <Input
            type="text"
            id="email"
            name="email"
            border="1px"
            borderColor="gray.400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl id="password" mb={4}>
        <FormLabel>パスワード</FormLabel>
          <Input
            type="password"
            id="password"
            name="password"
            border="1px"
            borderColor="gray.400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <Button type="submit" w="full" bg="teal.400" _hover={{opacity:0.8}}>登録</Button>
      </form>
    </Box>
   </Flex>
  );
};
