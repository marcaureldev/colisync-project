# Configuration Email pour ColiSync

## Variables d'environnement requises

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
# Configuration Email (Nodemailer)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# URL de l'application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Configuration Gmail

### 1. Activer l'authentification à deux facteurs
- Allez dans les paramètres de votre compte Google
- Activez l'authentification à deux facteurs

### 2. Générer un mot de passe d'application
- Allez dans "Sécurité" > "Mots de passe d'application"
- Sélectionnez "Mail" comme application
- Copiez le mot de passe généré (16 caractères)
- Utilisez ce mot de passe dans `EMAIL_PASSWORD`

### 3. Alternative : Configuration SMTP personnalisée

Si vous préférez utiliser un autre service email, modifiez la configuration dans `src/lib/emailService.ts` :

```typescript
const transporter = nodemailer.createTransporter({
  host: 'smtp.votreservice.com',
  port: 587,
  secure: false, // true pour 465, false pour les autres ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
```

## Test de la configuration

Vous pouvez tester la configuration email en ajoutant cette route de test :

```typescript
// /api/test-email
import { testEmailConnection } from '@/lib/emailService';

export async function GET() {
  const isConnected = await testEmailConnection();
  return Response.json({ connected: isConnected });
}
```

## Fonctionnalités implémentées

1. **Envoi automatique** : Un email est automatiquement envoyé lors de la création d'une invitation si un email est fourni
2. **Renvoyer un email** : Possibilité de renvoyer un email d'invitation existante
3. **Template HTML** : Email avec un design professionnel incluant le code d'invitation et le lien de création de compte
4. **Validation** : Vérification que l'invitation n'est pas expirée avant l'envoi

## Sécurité

- Les mots de passe d'application sont plus sécurisés que les mots de passe normaux
- Les emails ne sont envoyés qu'aux invitations valides et non expirées
- Seuls les administrateurs peuvent envoyer des invitations 