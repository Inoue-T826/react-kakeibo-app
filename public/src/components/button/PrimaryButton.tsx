import { Button} from "@chakra-ui/react";
import { memo, FC, ReactNode } from "react";
import React from "react";

type Props = {
    children: ReactNode;
    isDisabled ?: boolean;
    loading ?: boolean;
    onClick:() => void;
}

export const PrimaryButton: FC<Props> = memo((props) => {
   const {children, isDisabled=false, loading=false, onClick} = props;
    return (
        <Button 
        bg="teal.400" 
        color="white" 
        _hover={{opacity:0.8}} 
        onClick={onClick}
        isLoading={loading}
        isDisabled={isDisabled || loading}
        >
            {children}
        </Button>
  )
});