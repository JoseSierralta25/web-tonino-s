import fs from 'fs';
import path from 'path';

export default function Home() {
  // Este bloque lee tu archivo de la pizzería directamente desde la raíz
  const filePath = path.join(process.cwd(), 'homepage.html');
  const htmlContent = fs.readFileSync(filePath, 'utf8');

  return (
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
}
