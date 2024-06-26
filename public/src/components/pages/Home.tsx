import { Box, Button, Flex, Input, Stack, Text } from '@chakra-ui/react';
import { ChangeEvent, FC, memo, useEffect, useState } from 'react';
import { PrimaryButton } from '../button/PrimaryButton';
import topHeader from '../../topHeader.png';
import { useAuth } from '../providers/LoginUserProvider';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';


export const Home: FC = memo( () => {

  interface Transaction {
    id: string;
    addContent: string;
    addMoney: number;
    typePlus: boolean;
    month: string;
  }

const [allMoney, setAllMoney] = useState<number>(0);
const [allInMoney, setAllInMoney] = useState<number>(0);
const [allOutMoney, setAllOutMoney] = useState<number>(0);

const [inContent, setInContent] = useState<string[]>([]);
const [inMoney, setInMoney] = useState<number[]>([]);

const [outContent, setOutContent] = useState<string[]>([]);
const [outMoney, setOutMoney] = useState<number[]>([]);

const [addContent, setAddContent] = useState<string>("");
const [addMoney, setAddMoney] = useState<number | string>("");

const [typePlus, setTypePlus] = useState<boolean>(true);

const { currentUser, logout } = useAuth();
const navigate = useNavigate();


const onClickPlus = () => {
  setTypePlus(true);
};
const onClickMinus = () => {
  setTypePlus(false);
};

const onChangeAddContent = (event:ChangeEvent<HTMLInputElement>) => {
   setAddContent(event.target.value);
};
const onChangeAddMoney = (event:ChangeEvent<HTMLInputElement>) => {
  if(!isNaN(Number(event.target.value))) {
    setAddMoney(Number(event.target.value));
  } else {
  setAddMoney("");
  }
};

const getCurrentMonth = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
  return `${year}-${month}`;
};

const [currentMonth, setCurrentMonth] = useState<string>(getCurrentMonth());

const getPreviousMonth = (month: string) => {
  const [year, monthStr] = month.split('-');
  const date = new Date(Number(year), Number(monthStr) - 1);
  date.setMonth(date.getMonth() - 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const getNextMonth = (month: string) => {
  const [year, monthStr] = month.split('-');
  const date = new Date(Number(year), Number(monthStr) - 1);
  date.setMonth(date.getMonth() + 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const calcMoney = (inMoney: number[], outMoney: number[]) => {
  
    let newAllInMoney = 0;
    for (let i = 0; i < inMoney.length; i++) {
    newAllInMoney += inMoney[i];
    }
    let newAllOutMoney = 0;
      for (let i = 0; i < outMoney.length; i++) {
      newAllOutMoney += outMoney[i];
      }
      setAllOutMoney(newAllOutMoney)
    setAllInMoney(newAllInMoney);
    let newAllMoney = (newAllInMoney - newAllOutMoney);
    setAllMoney(newAllMoney);
};

const [transactions, setTransactions] = useState<Transaction[]>([]);

const saveData = async (uid: string, data: Transaction, collectionName: string) => {
  try {
    const docRef = await addDoc(collection(db, "users", uid, collectionName), data);
    console.log("データ保存成功", docRef.id);
  } catch (error) {
    console.error("データ保存エラー:", error);
  }
};

const getData = async (uid: string, month: string) => {
  try {
    const inColRef = collection(db, "users", uid, `incomes-${month}`);
    const outColRef = collection(db, "users", uid, `expenses-${month}`);

    const inSnapshot = await getDocs(inColRef);
    const outSnapshot = await getDocs(outColRef);

    const inTransactions: Transaction[] = [];
    const outTransactions: Transaction[] = [];

    inSnapshot.forEach((doc) => {
      const data = doc.data() as Transaction;
      inTransactions.push({...data, id: doc.id});
    });

    outSnapshot.forEach((doc) => {
      const data = doc.data() as Transaction;
      outTransactions.push({ ...data, id: doc.id });
    });

    setTransactions([...inTransactions, ...outTransactions]);

    const inContentTemp: string[] = [];
    const inMoneyTemp: number[] = [];
    const outContentTemp: string[] = [];
    const outMoneyTemp: number[] = [];

    inTransactions.forEach(transaction => {
      inContentTemp.push(transaction.addContent);
      inMoneyTemp.push(transaction.addMoney);
    });

    outTransactions.forEach(transaction => {
      outContentTemp.push(transaction.addContent);
      outMoneyTemp.push(transaction.addMoney);
    });

    setInContent(inContentTemp);
    setInMoney(inMoneyTemp);
    setOutContent(outContentTemp);
    setOutMoney(outMoneyTemp);

    calcMoney(inMoneyTemp, outMoneyTemp);

    console.log("データ取得成功");
  } catch (error) {
    console.error("データ取得エラー:", error);
  }
};

useEffect(() => {
  if (currentUser) {
    const uid = currentUser.uid;
    getData(uid, currentMonth);
  }
}, [currentUser, currentMonth]);

const onClickAdd = () => {
  if ((addContent === "") || (addMoney === "") || (addMoney === 0)) return;

  const newTransaction = { 
    id: `${new Date().getTime()}`,
    addContent, 
    addMoney: Number(addMoney), 
    typePlus, 
    month: currentMonth
  };

  const updatedTransactions = [...transactions, newTransaction];
  setTransactions(updatedTransactions);
  setAddContent("");
  setAddMoney("");

  if (auth.currentUser) {
    const uid = auth.currentUser.uid;
    const collectionName = `${typePlus ? "incomes" : "expenses"}-${currentMonth}`;
    saveData(uid, newTransaction, collectionName);
  }

  if (typePlus) {
    const newInContent = [...inContent, addContent];
    const newInMoney = [...inMoney, Number(addMoney)];
    setInContent(newInContent);
    setInMoney(newInMoney);
    calcMoney(newInMoney, outMoney);
  } else {
    const newOutContent = [...outContent, addContent];
    const newOutMoney = [...outMoney, Number(addMoney)];
    setOutContent(newOutContent);
    setOutMoney(newOutMoney);
    calcMoney(inMoney, newOutMoney);
  }
  
 };

 const onDelete = async (index: number, type: "in" | "out") => {
  if (!window.confirm("データを削除してもいいですか？")) return;

  let updatedTransactions = [...transactions];
  let docId: string | undefined;

  if (type === "in") {
    const newInContent = [...inContent];
    const newInMoney = [...inMoney];
    newInContent.splice(index, 1);
    newInMoney.splice(index, 1);
    setInContent(newInContent);
    setInMoney(newInMoney);
    calcMoney(newInMoney, outMoney);

    docId = transactions.filter(t => t.typePlus)[index]?.id;
    updatedTransactions = updatedTransactions.filter((t) => t.id !== docId);

  } else if(type === "out"){
    const newOutContent = [...outContent];
    const newOutMoney = [...outMoney];
    newOutContent.splice(index, 1);
    newOutMoney.splice(index, 1);
    setOutContent(newOutContent);
    setOutMoney(newOutMoney);
    calcMoney(inMoney, newOutMoney);
    
    docId = transactions.filter(t => !t.typePlus)[index]?.id;
    updatedTransactions = updatedTransactions.filter((t) => t.id !== docId);
    
    }
  if (auth.currentUser && docId) {
    const uid = auth.currentUser.uid;
    const collectionName =`${type === "in" ? "incomes" : "expenses"}-${currentMonth}`;
    const docRef = doc(db, "users", uid, collectionName, docId);
    await deleteDoc(docRef)
    .then(() => {
      setTransactions(updatedTransactions);

      saveRemainingData(uid, updatedTransactions);
    })
  };
 
}

const saveRemainingData = async (uid: string, transactions: Transaction[]) => {
  try {
    
    const months = transactions.map(t => t.month);
    const uniqueMonths = Array.from(new Set(months));

    for (const month of uniqueMonths) {
      const incomesCollection = collection(db, "users", uid, `incomes-${month}`);
      const expensesCollection = collection(db, "users", uid, `expenses-${month}`);

      const incomesSnapshot = await getDocs(incomesCollection);
      incomesSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      const expensesSnapshot = await getDocs(expensesCollection);
      expensesSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
    }

    for (const transaction of transactions) {
      const collectionName = transaction.typePlus ? `incomes-${transaction.month}` : `expenses-${transaction.month}`;
      await addDoc(collection(db, "users", uid, collectionName), transaction);
    }

    console.log("Remaining data successfully saved!");
  } catch (error) {
    console.error("Error saving remaining data: ", error);
  }
};


useEffect(() => {
  console.log('Transactions updated:', transactions);
}, [transactions]);


 const handleLogout = async () => {
  try {
    await logout();
     navigate("/");
  } catch {
    console.error("Failed to log out");
  }
};


 return (
    <Box minH="100vh">
      <Flex
       as="nav"
       minH="25vh"
       bgImage = {topHeader}
       bgSize="cover"         
       bgPosition="center"
       align="center"
       justify="center"
      >
         <Stack
         as="nav"
         w="full"
         align="center"
         >
          <Flex alignItems="center">
           <Button onClick={() => setCurrentMonth(getPreviousMonth(currentMonth))} mx={2} px="8px" bg="green.400">1月前</Button>
           <Box fontSize="20px" color="green.800">{currentMonth}</Box>
           <Button onClick={() => setCurrentMonth(getNextMonth(currentMonth))} mx={2} px="8px" bg="green.400">1月後</Button>
          </Flex>
          <Box as="h1" fontSize="35px" fontWeight="bold">合計: {allMoney}円</Box>
       <Flex
           as="nav"
           w="full"
           justify="center"
           >
           <Box as="h2" fontSize="xl" px={{base:10, md:20}}>収入: +{allInMoney}円</Box>
           <Box as="h2" fontSize="xl" px={{base:10, md:20}}> 支出: -{allOutMoney}円</Box>
          </Flex>
         </Stack>
      </Flex>
      <Flex
      as="nav"
      minH="15vh"
      bg="orange.100"
      align="center"
      justify="center"
      padding={{base: 3, md: 5}}>
         <Button 
          onClick={onClickPlus}
          mx={4}
          style={{
           backgroundColor: typePlus ? 'blue' : 'white',
           color: typePlus ? 'white' : 'black'
          }}>+</Button>
         <Button 
          onClick={onClickMinus}
          mx={4}
          style={{
           backgroundColor: typePlus ? 'white' : 'red',
           color: typePlus ? 'black' : 'white'
          }}>-</Button>
         <Box mx={5}>
          内容<Input value={addContent} onChange={onChangeAddContent} bg="white"/>
         </Box>
         <Box mx={5}>
          金額（円）<Input value={addMoney} onChange={onChangeAddMoney} bg="white"/>
         </Box>
         <PrimaryButton onClick={onClickAdd} >追加</PrimaryButton>
      </Flex>
      <Flex
      as="nav"
      minH="55vh"
      bg="gray.100"
      justify="space-around"
      align="center"
      wrap="nowrap"
      >
         <Stack  width={{base:"45%",md:"35%"}}  bg="blue.100" borderRadius={10}
           p={4}
           spacing={4}>
         <Text fontSize="xl" fontWeight="bold" mb={10} align="center" >収入一覧</Text>
           {inContent.map((inContent, index) => {
             return (
               <Flex  key={index} justify="space-between" mb={2}>
                 <Text fontSize="lg" mr={{base:3,sm:10}}>{inContent}</Text>
                 <Text fontSize="lg">+{inMoney[index]}円
                  <Button onClick={() => {onDelete(index, "in")}} w={1} bg="blue.200">×</Button>
                </Text>
               </Flex>
             )
           }
         )}
         </Stack>
        
         <Stack width={{base:"45%",md:"35%"}} bg="red.100" borderRadius={10} 
           p={4}
           spacing={4}>
         <Text fontSize="xl" fontWeight="bold" mb={10} align="center">支出一覧</Text>
         {outContent.map((outContent, index) => {
             return (
               <Flex key={index} justify="space-between" mb={2}>
                 <Text fontSize="lg" mr={{base:3,sm:10}}>{outContent}</Text>
                 <Text fontSize="lg">-{outMoney[index]}円
                  <Button onClick={() => {onDelete(index, "out")}} w={1} bg="red.200">×</Button>
                </Text>
               </Flex>
             )
           }
         )}
         </Stack>
      </Flex>
      <Flex minH="5vh" bg="teal.100" alignItems="center" justifyContent="center">
       <Text mr={5} >Welcome, {currentUser?.email}</Text>
       <Button onClick={handleLogout} my={2}>ログアウト</Button>
      </Flex>
    </Box>
 );
}
);
