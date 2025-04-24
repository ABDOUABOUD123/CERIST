import React from 'react';
import './Comites.css';

const Comites = () => {
  return (
    <div className="comites-page">
      <h1>Comités</h1>
      
      <div className="comite-section">
        <div className="comite-card">
          <h2>Directeur de la publication</h2>
          <p className="member-name">BADACHE Nadjib</p>
        </div>

        <div className="comite-card">
          <h2>Editeur en chef</h2>
          <p className="member-name">Hassina Aliane</p>
        </div>

        <div className="comite-card">
          <h2>Coordinateur de Rédaction</h2>
          <p className="member-name">Adjerad Halima Douniazed</p>
        </div>

        <div className="comite-card">
          <h2>Traduction</h2>
          <p className="member-name">Adour Rafik</p>
        </div>
      </div>

      <div className="comite-section">
        <h2 className="section-title">Comité de Rédaction</h2>
        <div className="members-grid">
          <p className="member-name">Aithadadene Hacene, USTHB</p>
          <p className="member-name">Allahoum Rabah, Université Alger2</p>
          <p className="member-name">Bouderbane Azzedine, Université de Constantine</p>
          <p className="member-name">Nouali Omar, CERIST</p>
          <p className="member-name">Meziane Abdelkrim, CERIST</p>
        </div>
      </div>

      <div className="comite-section">
        <h2 className="section-title">Comité Scientifique</h2>
        <div className="members-grid scientific">
          <p className="member-name">Ahmed Guessoum, USTHB, Alger.</p>
          <p className="member-name">Aicha Aissani Mokhtari, USTHB</p>
          <p className="member-name">Ali Farghaly, USA.</p>
          <p className="member-name">Ali Jioua, Quatar</p>
          <p className="member-name">Azzedine Bouderbane, Université de Constantine</p>
          <p className="member-name">Boukhalfa Kamel, USTHB</p>
          <p className="member-name">Brigitte Guyot, France</p>
          <p className="member-name">Fatma-Zohra Belkredim, Chlef</p>
          <p className="member-name">Hacene Aithadadene, USTHB</p>
          <p className="member-name">Hacid Mohand-Said, France.</p>
          <p className="member-name">Hamdani Abdelfattah, Maroc</p>
          <p className="member-name">Hamid Azzoune, USTHB</p>
          <p className="member-name">Hassina Aliane, CERIST</p>
          <p className="member-name">Karima Akli, USTHB</p>
          <p className="member-name">Karim Bouzoubaa, Maroc</p>
          <p className="member-name">Latifa Mahdaoui, USTHB, Alger.</p>
          <p className="member-name">Maciano Richard, USA.</p>
          <p className="member-name">Mohand Boughanem, IRIT, France.</p>
          <p className="member-name">Nasreddine Semmar, France</p>
          <p className="member-name">Rabah Allahoum, Université Alger2</p>
          <p className="member-name">Omar Nouali, CERIST</p>
          <p className="member-name">Sihem Boulaknadel, Maroc</p>
          <p className="member-name">Thierry Lafourge, Lyon1 France.</p>
          <p className="member-name">Violetta Cavalli-Sforza, Maroc</p>
          <p className="member-name">Youcef Amghar, LIRIS, France.</p>
          <p className="member-name">Zaia Alimazighi, USTHB</p>
        </div>
      </div>

      <p className="date">mai 12th, 2016</p>
    </div>
  );
};

export default Comites;