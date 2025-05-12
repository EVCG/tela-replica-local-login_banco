
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Vibrate } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface OTPVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (code: string) => void;
}

const OTPVerificationModal: React.FC<OTPVerificationModalProps> = ({
  isOpen,
  onClose,
  onVerify,
}) => {
  const [code, setCode] = useState("");
  const [isError, setIsError] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const { toast } = useToast();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      onClose();
      toast({
        variant: "destructive",
        title: "Tempo expirado",
        description: "O código expirou. Por favor, solicite um novo código.",
      });
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeLeft, isOpen, onClose, toast]);

  useEffect(() => {
    if (isOpen) {
      setTimeLeft(120);
      setCode("");
      setIsError(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      toast({
        variant: "destructive",
        title: "Código inválido",
        description: "Por favor, insira o código completo de 6 dígitos.",
      });
      return;
    }

    try {
      await onVerify(code);
    } catch (error) {
      setIsError(true);
      setCode("");
      toast({
        variant: "destructive",
        title: "Código incorreto",
        description: "O código inserido está incorreto. Tente novamente.",
      });

      // Reset error state after animation
      setTimeout(() => {
        setIsError(false);
      }, 1000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Verificação de Código</DialogTitle>
          <DialogDescription>
            Digite o código de 6 dígitos enviado ao seu email.
            Tempo restante: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className={`flex justify-center py-4 ${isError ? 'animate-shake' : ''}`}>
            <InputOTP
              value={code}
              onChange={setCode}
              maxLength={6}
              render={({ slots }) => (
                <InputOTPGroup>
                  {slots.map((slot, index) => (
                    <InputOTPSlot
                      key={index}
                      {...slot}
                      index={index}
                      className={isError ? 'border-destructive' : ''}
                    />
                  ))}
                </InputOTPGroup>
              )}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={code.length !== 6 || timeLeft === 0}>
              Verificar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OTPVerificationModal;
