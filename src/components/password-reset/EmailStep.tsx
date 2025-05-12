
import React from 'react';
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";

interface EmailStepProps {
  email: string;
  setEmail: (email: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

const EmailStep: React.FC<EmailStepProps> = ({
  email,
  setEmail,
  onSubmit,
  isSubmitting
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">E-mail</label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu.email@exemplo.com"
          required
          autoComplete="email"
        />
      </div>
      <DialogFooter>
        <DialogClose data-reset-password-close asChild>
          <Button type="button" variant="outline">Cancelar</Button>
        </DialogClose>
        <Button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Enviando..." : "Enviar Código"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default EmailStep;
