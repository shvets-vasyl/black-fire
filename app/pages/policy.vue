<template>
  <main class="policy">
    <div class="grid">
      <div class="aside">
        <h2 class="title h2">privacy <br />policy</h2>
        <p class="updated p2">Last updated: October 9, 2026</p>
      </div>

      <div class="body p1">
        <section class="section">
          <h3 class="section-title">1. Who we are</h3>
          <p>
            This website, blackfire.studio, is operated by BlackFire Studio ("BlackFire",
            "we", "us"). We are the controller of your personal data. For any privacy
            questions, contact us at
            <a class="mail" href="mailto:sayhi@blackfire.studio">sayhi@blackfire.studio</a
            >.
          </p>
        </section>

        <div class="line" />

        <section class="section">
          <h3 class="section-title">2. What data we collect</h3>
          <ul class="list">
            <li>
              Data you give us: when you fill in a contact form or email us, we collect
              your name, email, phone number, company name, your message and how you heard
              about us.
            </li>
            <li>
              Data collected automatically: IP address, browser and device type, pages
              visited and time spent on the site, collected through cookies and similar
              technologies.
            </li>
          </ul>
        </section>

        <div class="line" />

        <section class="section">
          <h3 class="section-title">3. Why we use your data</h3>
          <ul class="list">
            <li>
              To reply to your requests and prepare proposals (legal basis: steps prior to
              entering into a contract).
            </li>
            <li>
              To deliver our services and manage client relationships (legal basis:
              performance of a contract).
            </li>
            <li>
              To keep the website secure and improve it (legal basis: our legitimate
              interest).
            </li>
            <li>
              To send news or marketing messages, only if you agreed (legal basis:
              consent, which you can withdraw at any time).
            </li>
          </ul>
        </section>

        <div class="line" />

        <section class="section">
          <h3 class="section-title">4. Who we share data with</h3>
          <p>
            We never sell your data. We share it only with trusted providers who help us
            run the website and our business, such as hosting and security services (e.g.
            Cloudflare), email and workspace tools (e.g. Google Workspace) and analytics
            services. They process data only on our instructions. We may also disclose
            data if required by law.
          </p>
        </section>

        <div class="line" />

        <section class="section">
          <h3 class="section-title">5. International transfers</h3>
          <p>
            Some of our providers may process data outside the European Economic Area. In
            such cases we make sure appropriate safeguards are in place, such as the EU
            Standard Contractual Clauses.
          </p>
        </section>

        <div class="line" />

        <section class="section">
          <h3 class="section-title">6. How long we keep data</h3>
          <p>
            We keep inquiry data for up to 24 months after our last contact, and client
            data for as long as required by contract and law (e.g. accounting rules).
            After that, data is deleted or anonymized.
          </p>
        </section>

        <div class="line" />

        <section class="section">
          <h3 class="section-title">7. Cookies</h3>
          <p>
            We use necessary cookies to make the website work and, with your consent,
            analytics cookies to understand how it is used. You can change your cookie
            preferences at any time in the cookie banner or in your browser settings.
          </p>
        </section>

        <div class="line" />

        <section class="section">
          <h3 class="section-title">8. Your rights</h3>
          <p>
            Under the GDPR you have the right to access, correct or delete your data,
            restrict or object to its processing, request a copy of your data, and
            withdraw consent at any time. To exercise any of these rights, email us at
            <a class="mail" href="mailto:sayhi@blackfire.studio">sayhi@blackfire.studio</a
            >. You also have the right to file a complaint with the Polish data protection
            authority (UODO,
            <a
              class="mail"
              href="https://uodo.gov.pl"
              target="_blank"
              rel="noopener noreferrer"
              >uodo.gov.pl</a
            >) or the authority in your country.
          </p>
        </section>

        <div class="line" />

        <section class="section">
          <h3 class="section-title">9. Security</h3>
          <p>
            We use technical and organizational measures to protect your data from loss,
            misuse and unauthorized access.
          </p>
        </section>

        <div class="line" />

        <section class="section">
          <h3 class="section-title">10. Children</h3>
          <p>
            Our services are not intended for children under 16, and we do not knowingly
            collect their data.
          </p>
        </section>

        <div class="line" />

        <section class="section">
          <h3 class="section-title">11. Changes to this policy</h3>
          <p>
            We may update this policy from time to time. The current version is always
            available on this page, with the date of the last update at the top.
          </p>
        </section>

        <div class="line" />

        <section class="section">
          <h3 class="section-title">12. Contact</h3>
          <p>BlackFire Studio</p>
          <p>
            <a class="mail" href="mailto:sayhi@blackfire.studio"
              >sayhi@blackfire.studio</a
            >
          </p>
        </section>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
useHead({
  title: "Privacy Policy",
})

useAfterTransition(useCommonAnimations)
</script>

<style scoped lang="scss">
.policy {
  min-height: 100vh;
  padding: 12.5rem 0 4rem;
  background: var(--c-black);

  @include mobile {
    padding: 9rem 0 3rem;
  }
}

.grid {
  display: grid;
  grid-template-columns: 50% 50%;
  align-items: start;

  @include mobile {
    grid-template-columns: 100%;
  }
}

.aside {
  position: sticky;
  top: 12.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 0 2rem 0 1.5rem;

  @include mobile {
    position: static;
    gap: 1rem;
    padding: 0 1rem 7rem;
  }
}

.updated {
  opacity: 0.5;
}

.body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0 8.8125rem 0 1.5rem;
  line-height: 1.25rem;

  @include mobile {
    padding: 0 1rem;
  }
}

.line {
  width: 100%;
  height: 0.0625rem;
  background: rgba(255, 255, 255, 0.1);
  margin: 1rem 0;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-title {
  font-family: var(--f-medium);
  font-size: 1.25rem;
  line-height: 1.4;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-left: 1.25rem;
  list-style: disc;
}

.mail {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 0.15em;
}

.title br {
  @include mobile {
    display: none;
  }
}
</style>
