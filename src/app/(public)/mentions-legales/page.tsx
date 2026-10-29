import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: 'Éditeur, direction de publication, hébergement et informations juridiques du site de la commune de Mœuvres.',
};

export default function Legal() {
  return (
    <main id="main" className="container public-page article legal-page">
      <p className="eyebrow">INFORMATIONS JURIDIQUES</p>
      <h1>Mentions légales</h1>
      <p className="article-intro">
        Les présentes mentions légales concernent le site internet institutionnel de la commune de Mœuvres (59400).
      </p>

      <section className="legal-section" aria-labelledby="editeur">
        <h2 id="editeur">1. Éditeur du site</h2>
        <p><strong>Commune de Mœuvres — Mairie de Mœuvres</strong><br />
          Grand’Place, 59400 Mœuvres, France<br />
          Téléphone : <a href="tel:+33327825039">03 27 82 50 39</a><br />
          Courriel : <a href="mailto:moeuvres@wanadoo.fr">moeuvres@wanadoo.fr</a><br />
          SIREN : 215 904 053
        </p>
        <p>Le site présente les actualités, l’agenda, les informations pratiques, les services, les associations et les documents de la commune.</p>
      </section>

      <section className="legal-section" aria-labelledby="publication">
        <h2 id="publication">2. Direction de la publication</h2>
        <p><strong>Damien PLATAUX</strong>, maire de Mœuvres, est le directeur de la publication du site.</p>
      </section>

      <section className="legal-section" aria-labelledby="realisation">
        <h2 id="realisation">3. Conception, réalisation et administration</h2>
        <p><strong>Céline PETIT</strong><br />
          Contact technique : <a href="mailto:moeuvres.afc@gmail.com">moeuvres.afc@gmail.com</a>
        </p>
        <p>Cette adresse est réservée aux questions concernant le fonctionnement du site. Pour les démarches administratives, veuillez contacter directement la mairie.</p>
      </section>

      <section className="legal-section" aria-labelledby="hebergement">
        <h2 id="hebergement">4. Hébergement et services techniques</h2>
        <p><strong>Hébergement du site : Vercel Inc.</strong><br />
          440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis<br />
          Site internet : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a>
        </p>
        <p><strong>Base de données, stockage de fichiers et authentification : Supabase</strong><br />
          Supabase Pte. Ltd.<br />
          65 Chulia Street #38-02/03, OCBC Centre, Singapore 049513, Singapour<br />
          Site internet : <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">supabase.com</a>
        </p>
        <p>Ces prestataires interviennent dans l’exploitation technique du site. La localisation effective des infrastructures et les éventuels transferts de données sont soumis aux paramètres et garanties contractuelles des services utilisés.</p>
      </section>

      <section className="legal-section" aria-labelledby="contenus">
        <h2 id="contenus">5. Contenus et propriété intellectuelle</h2>
        <p>La commune veille à l’exactitude et à l’actualisation des informations publiées. Malgré cette vigilance, des erreurs ou changements peuvent survenir. Pour signaler une information inexacte, contactez la mairie.</p>
        <p>La réutilisation des informations publiques et des documents administratifs est régie par le Code des relations entre le public et l’administration, notamment les règles relatives à la mention de la source et de la date de mise à jour.</p>
        <p>Les photographies, illustrations, logos et autres créations protégées restent soumis aux droits de leurs auteurs et, lorsqu’il s’agit de personnes photographiées, au respect du droit à l’image. Leur reproduction nécessite les autorisations appropriées, sauf exception prévue par la loi.</p>
      </section>

      <section className="legal-section" aria-labelledby="liens">
        <h2 id="liens">6. Liens vers d’autres sites</h2>
        <p>Des liens peuvent renvoyer vers des sites extérieurs. La commune n’en contrôle ni les contenus ni les politiques de confidentialité. La consultation de ces sites relève de leurs propres conditions d’utilisation.</p>
      </section>

      <section className="legal-section" aria-labelledby="donnees">
        <h2 id="donnees">7. Protection des données personnelles</h2>
        <p>La commune de Mœuvres est responsable des traitements de données personnelles qu’elle met en œuvre dans le cadre de ce site.</p>
        <p>Selon l’usage du site, les données concernées peuvent comprendre les informations présentes dans les publications municipales, les coordonnées transmises à la mairie par courriel, les données techniques de connexion et les informations nécessaires à l’accès sécurisé à l’espace d’administration.</p>
        <p>Ces traitements poursuivent les finalités d’information du public, de réponse aux demandes reçues et de sécurisation de l’administration du site. Ils reposent, selon les cas, sur l’exécution d’une mission d’intérêt public, une obligation légale ou une autre base juridique applicable.</p>
        <p>Seules les personnes et les prestataires habilités peuvent accéder aux données dans la limite de leurs missions. Les informations sont conservées pour les durées nécessaires à leurs finalités et, le cas échéant, selon les règles applicables aux archives publiques.</p>
        <p>Conformément au règlement général sur la protection des données (RGPD), vous pouvez exercer les droits applicables à votre situation, notamment les droits d’accès, de rectification, d’effacement, de limitation et d’opposition.</p>
        <p>Pour toute demande relative à vos données personnelles ou destinée au délégué à la protection des données (DPO), écrivez à <a href="mailto:moeuvres@wanadoo.fr">moeuvres@wanadoo.fr</a> ou adressez un courrier à la mairie, à l’adresse indiquée ci-dessus, en précisant « À l’attention du DPO ».</p>
        <p>Vous pouvez également introduire une réclamation auprès de la <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer">Commission nationale de l’informatique et des libertés (CNIL)</a>.</p>
      </section>

      <section className="legal-section" aria-labelledby="cookies">
        <h2 id="cookies">8. Cookies et traceurs</h2>
        <p>Dans la version actuelle du site, aucun dispositif publicitaire ni outil de mesure d’audience n’est intégré. L’espace d’administration peut utiliser des cookies techniques nécessaires à l’authentification et au maintien de la session de connexion.</p>
        <p>Si des traceurs facultatifs sont ajoutés ultérieurement, les informations et, lorsque la réglementation l’impose, les mécanismes de consentement seront adaptés avant leur utilisation.</p>
      </section>

      <section className="legal-section" aria-labelledby="accessibilite">
        <h2 id="accessibilite">9. Accessibilité numérique</h2>
        <p>La commune souhaite rendre les contenus du site accessibles au plus grand nombre. L’état de conformité au Référentiel général d’amélioration de l’accessibilité (RGAA) doit être établi et publié dans une déclaration d’accessibilité dédiée après évaluation.</p>
        <p>Si vous rencontrez une difficulté pour consulter un contenu ou effectuer une démarche, vous pouvez contacter la mairie au <a href="tel:+33327825039">03 27 82 50 39</a> ou par courriel à <a href="mailto:moeuvres@wanadoo.fr">moeuvres@wanadoo.fr</a> afin de demander une solution adaptée.</p>
      </section>

      <p className="muted">Dernière mise à jour : 29 octobre 2026.</p>
    </main>
  );
}
