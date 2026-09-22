# MyFinances agent guidance

## Project shape

- This repository has two independently runnable modules: `back-end/` (Spring Boot REST API) and `mobile/` (Expo Router React Native app).
- Keep backend and mobile changes separated unless the API contract requires a coordinated update.
- The root `package.json` is not the mobile application manifest. Run JavaScript commands from `mobile/`.
- See [readme.md](readme.md) for the product overview and [mobile/README.md](mobile/README.md) for Expo basics.

## Backend

- Use Java 21, Spring Boot 3.5, Maven, Spring Data JPA, SQL Server, validation, Spring Security crypto, and Spring Mail.
- Controllers are under `back-end/src/main/java/com/bruno/MyFinances/Controller`; business logic is in `service`; entities are in `models`; repositories are in `repository`; request/response types are in `dto`.
- Follow the existing constructor-injection and DTO response patterns. Check existing controller and service code before introducing a new abstraction.
- Run from PowerShell in `back-end/`:
  - `./mvnw.cmd clean test` for tests
  - `./mvnw.cmd clean package` for a packaged build
  - `./mvnw.cmd spring-boot:run` to run locally
- The context test currently depends on the configured application environment. Do not assume database-backed tests are isolated.
- Treat `back-end/src/main/resources/application.properties` as local configuration. Never copy its credentials into source, documentation, logs, or test fixtures; prefer environment-specific configuration for new secrets.

## Mobile

- The mobile app uses Expo SDK 57, Expo Router file-based navigation, TypeScript strict mode, and the `@/*` path alias.
- Route screens live in `mobile/app/`; authentication is under `mobile/app/(auth)/`, main tabs under `mobile/app/(tabs)/`, and shared theme/UI code under `mobile/components`, `mobile/constants`, and `mobile/hooks`.
- Run from `mobile/`: `npm install`, `npm run lint`, `npm start`, `npm run android`, `npm run ios`, or `npm run web`.
- Read [mobile/AGENTS.md](mobile/AGENTS.md) for the Expo documentation requirement. Use the version matching `mobile/package.json` when checking Expo APIs.
- API calls currently target a LAN address. Preserve the existing networking approach unless the task explicitly changes environment configuration, and verify contracts against the backend DTO/controller before renaming fields.

## Change and validation rules

- Make the smallest change that fits the owning module and preserve existing public API shapes unless a contract change is intentional.
- For backend changes, run the narrowest relevant Maven test, then the full test suite when practical. For mobile changes, run `npm run lint`.
- Do not edit generated `target/` output. Keep unrelated working-tree changes intact.