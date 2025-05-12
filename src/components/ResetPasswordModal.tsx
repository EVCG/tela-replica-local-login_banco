
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { authService } from '@/services/authService';
import OTPVerificationModal from './OTPVerificationModal';
import EmailStep from './password-reset/EmailStep';
import NewPasswordStep from './password-reset/NewPasswordStep';

interface ResetPasswordModalProps {
  trigger?: React.ReactNode;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ trigger }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showNewPasswordForm, setShowNewPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { toast } = useToast();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await authService.sendResetCode(email);
      if (result.success) {
        toast({
          title: "Código enviado",
          description: "Um código de verificação foi enviado para seu email.",
        });
        setShowOTPModal(true);
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao enviar código",
          description: "Não foi possível enviar o código. Verifique o email informado.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao processar sua solicitação.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async (code: string) => {
    try {
      const result = await authService.verifyResetCode(email, code);
      if (result.success) {
        setShowOTPModal(false);
        setShowNewPasswordForm(true);
        toast({
          title: "Código verificado",
          description: "Agora você pode definir uma nova senha.",
        });
      } else {
        throw new Error("Código inválido");
      }
    } catch (error) {
      throw error;
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Senhas diferentes",
        description: "A nova senha e a confirmação devem ser iguais.",
      });
      return;
    }

    try {
      const result = await authService.resetPassword(email, newPassword);
      if (result.success) {
        toast({
          title: "Senha alterada",
          description: "Sua senha foi alterada com sucesso.",
        });
        // Reset states and close modal
        setNewPassword('');
        setConfirmPassword('');
        setEmail('');
        setShowNewPasswordForm(false);
        const closeButton = document.querySelector('[data-reset-password-close]');
        if (closeButton instanceof HTMLButtonElement) {
          closeButton.click();
        }
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível alterar sua senha.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao alterar sua senha.",
      });
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          {trigger || <Button variant="link" className="text-sm">Esqueceu sua senha?</Button>}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Recuperação de Senha</DialogTitle>
            <DialogDescription>
              {showNewPasswordForm
                ? "Digite sua nova senha."
                : "Digite seu e-mail abaixo e enviaremos um código de verificação."}
            </DialogDescription>
          </DialogHeader>

          {showNewPasswordForm ? (
            <NewPasswordStep
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              onSubmit={handlePasswordReset}
            />
          ) : (
            <EmailStep
              email={email}
              setEmail={setEmail}
              onSubmit={handleSendCode}
              isSubmitting={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>

      <OTPVerificationModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        onVerify={handleVerifyCode}
      />
    </>
  );
};

export default ResetPasswordModal;
