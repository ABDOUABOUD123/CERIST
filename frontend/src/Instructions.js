import React from 'react';
import './Instructions.css'; // We'll create this next

const Instructions = () => {
  return (
    <div className="instructions-page">
      <h1>Instructions aux auteurs</h1>
      
      <section className="instructions-section">
        <h2>Instructions aux auteurs:</h2>
        <p>
          Les auteurs doivent soumettre des articles de 10 pages (minimum) qui se rapportent aux thématiques de la revue. 
          Les articles sont principalement rédigés en arabe et en français, toutefois la revue accepte aussi les articles 
          rédigés en anglais. Chaque article doit être accompagné d'un résumé et d'une liste de 4 à 6 mots clés rédigés 
          dans la langue du papier (ex : français). Les auteurs sont également conviés à fournir, si possible, la traduction 
          de leur résumé et des mots clés dans les deux autres langues (ex : arabe et anglais).
        </p>
      </section>

      <section className="instructions-section">
        <h2>Protocole de rédaction:</h2>
        <p>
          Les modèles des articles pour Word sont téléchargeables ci-dessous :
        </p>
        <ul className="download-links">
          <li><a href="/path/to/Rist.dot" download>Feuille de style en format Word: .dot</a></li>
          <li><a href="/path/to/Rist.doc" download>Feuille de style et consignes en fichier Doc: .doc</a></li>
        </ul>
        <p>Pour l'utilisation du modèle Word, il faut suivre les étapes:</p>
        <ol>
          <li>Enregistrer le fichier modèle Rist.dot au niveau du répertoire des Modèles de votre ordinateur</li>
          <li>Après avoir activer Word, cliquer sur Nouveau ensuite choisir le modèle Rist.dot</li>
          <li>Dans le cas ou votre article est déjà fait, utiliser le menu Outils puis Modèles et Compléments pour attacher et sélectionner le modèle dot.</li>
          <li>Après l'installation de la feuille de style, cliquez sur format ensuite styles et mise en forme. Une fenêtre s'affiche du côté droit de l'écran contenant tous les styles définis dans la feuille de style dot.</li>
          <li>Pour génerer le format Pdf à partir du Word, il faut imprimer l'article dans un fichier en ayant choisi comme imprimante une imprimante de type Pdf.</li>
        </ol>
      </section>

      <section className="instructions-section">
        <h2>Soumission d'un article:</h2>
        <p>
          Les articles rédigés en respectant les feuilles de styles proposées doivent être adressés à la rédaction sous format Word ou Pdf. 
          Les soumissions peuvent se faire :
        </p>
        <ul>
          <li>
            <strong>Par voie électronique :</strong> l'article en format Word ou Pdf est attaché à un mail, ayant comme sujet « Soumission pour RIST » 
            et envoyé à l'adresse : <a href="mailto:Rist@mail.cerist.dz">Rist@mail.cerist.dz</a>
          </li>
          <li>
            <strong>Par courrier</strong> en envoyant une version papier et une version électronique (Word ou pdf) gravée un CD à l'adresse :<br />
            Mme. ALIANE Hassina<br />
            Rédactrice en Chef de la revue Rist<br />
            CERIST, 3 rue des frères Aissou, Ben Aknoun, Alger Algérie
          </li>
        </ul>
        <p>
          Suite à l'opération d'évaluation par deux à trois référés spécialisés, la revue adresse aux auteurs la notification 
          d'acceptation ou de rejet, les rapports d'évaluation ainsi que le contrat d'édition de l'article.
        </p>
      </section>

      <section className="instructions-section">
        <h2>Droits et engagements de l'auteur:</h2>
        <ul>
          <li>Un article soumis ne doit pas être déjà envoyé à d'autres revues.</li>
          <li>Dans le cas échéant, les auteurs de l'article doivent posséder tous les droits nécessaires pour sa publication dans la revue RIST.</li>
          <li>Suite à l'acceptation d'un article, ces auteurs sont tenus de signer un contrat d'édition incluant, notamment, leur accord pour une diffusion simultanée de leur article via Internet.</li>
          <li>La publication d'un article dans la revue RIST ne donne pas lieu ni à des charges ni à une rémunération des auteurs.</li>
        </ul>
        <p className="date">mai 12th, 2016</p>
      </section>
    </div>
  );
};

export default Instructions;