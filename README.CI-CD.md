# 🦦 Platypus QA Lab - CI/CD Documentation

Complete guide for the Continuous Integration and Continuous Deployment pipelines.

## 📋 Overview

Platypus QA Lab uses GitHub Actions for automated testing, building, and deployment. The CI/CD pipeline ensures code quality and smooth deployments.

## 🔄 Workflows

### 1. CI/CD Pipeline (`ci.yml`)

**Triggers:**
- Push to `main`, `develop`, or `staging` branches
- Pull requests to `main` or `develop`

**Jobs:**

#### Lint & Type Check
- Runs ESLint for code quality
- Performs TypeScript type checking
- Continues on error (non-blocking)

#### Unit Tests
- Executes Jest unit tests
- Generates code coverage reports
- Uploads coverage artifacts

#### Build Application
- Builds Next.js production bundle
- Validates build success
- Uploads build artifacts

#### E2E Tests (Playwright)
- Installs Playwright browsers
- Runs end-to-end tests
- Uploads test results and reports

#### Security Audit
- Runs `npm audit` for vulnerabilities
- Checks for moderate+ severity issues
- Non-blocking (continues on error)

#### Generate QA Report
- Aggregates all test results
- Creates comprehensive QA summary
- Comments on PRs with results
- Includes "Platypus Says" humor

### 2. Docker Build & Push (`docker.yml`)

**Triggers:**
- Push to `main` or `develop`
- Version tags (`v*.*.*`)
- Pull requests to `main`

**Features:**
- Multi-platform builds (amd64, arm64)
- Pushes to GitHub Container Registry (GHCR)
- Generates build attestations
- Docker Scout CVE scanning
- Build caching for faster builds

**Image Tags:**
- `latest` - Latest main branch
- `main` - Main branch builds
- `develop` - Development branch
- `v1.2.3` - Semantic version tags
- `sha-abc123` - Commit SHA tags

### 3. Deploy to Production (`deploy.yml`)

**Triggers:**
- Push to `main` branch
- Version tags
- Manual workflow dispatch

**Features:**
- Deploys to Vercel
- Runs smoke tests
- Environment selection (production/staging)
- Deployment notifications

## 🚀 Setup Instructions

### Prerequisites

1. **GitHub Repository Secrets**

Navigate to: `Settings > Secrets and variables > Actions`

Add the following secrets:

\`\`\`
VERCEL_TOKEN          # Vercel deployment token
VERCEL_ORG_ID         # Vercel organization ID
VERCEL_PROJECT_ID     # Vercel project ID
\`\`\`

2. **GitHub Permissions**

Ensure the following permissions are enabled:
- `Settings > Actions > General > Workflow permissions`
- Select "Read and write permissions"
- Check "Allow GitHub Actions to create and approve pull requests"

### Getting Vercel Credentials

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link project
vercel link

# Get project details
vercel project ls

# Get org and project IDs from .vercel/project.json
cat .vercel/project.json
\`\`\`

### Container Registry Setup

1. **Enable GitHub Packages**
   - Automatically enabled for public repos
   - For private repos: `Settings > Packages`

2. **Pull Images**
   \`\`\`bash
   # Login to GHCR
   echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin
   
   # Pull image
   docker pull ghcr.io/your-username/platypus-qa-lab:latest
   \`\`\`

## 📊 Workflow Status Badges

Add to your README.md:

\`\`\`markdown
![CI/CD](https://github.com/your-username/platypus-qa-lab/workflows/Platypus%20QA%20Lab%20-%20CI%2FCD%20Pipeline/badge.svg)
![Docker](https://github.com/your-username/platypus-qa-lab/workflows/Docker%20Build%20%26%20Push/badge.svg)
![Deploy](https://github.com/your-username/platypus-qa-lab/workflows/Deploy%20to%20Production/badge.svg)
\`\`\`

## 🔧 Customization

### Modify Node Version

Edit all workflow files:

\`\`\`yaml
env:
  NODE_VERSION: '20'  # Change to desired version
\`\`\`

### Add Environment Variables

For build-time variables:

\`\`\`yaml
- name: Build application
  run: npm run build
  env:
    NEXT_PUBLIC_API_URL: ${{ secrets.API_URL }}
    CUSTOM_VAR: ${{ vars.CUSTOM_VAR }}
\`\`\`

### Change Test Commands

\`\`\`yaml
- name: Run unit tests
  run: npm run test:unit -- --coverage --maxWorkers=2
\`\`\`

### Modify Docker Platforms

\`\`\`yaml
platforms: linux/amd64,linux/arm64,linux/arm/v7
\`\`\`

## 📈 Monitoring & Artifacts

### Viewing Artifacts

1. Go to workflow run
2. Scroll to "Artifacts" section
3. Download:
   - `unit-test-coverage` - Code coverage reports
   - `playwright-results` - E2E test results
   - `nextjs-build` - Production build
   - `qa-report` - Comprehensive QA summary

### Artifact Retention

- Test results: 30 days
- Build artifacts: 7 days
- QA reports: 90 days

## 🐛 Troubleshooting

### Build Failures

\`\`\`bash
# Run locally to debug
npm ci
npm run build

# Check logs in GitHub Actions
# Actions > Failed workflow > Job > Step
\`\`\`

### Test Failures

\`\`\`bash
# Run tests locally
npm run test:unit
npm run test:e2e

# Debug Playwright
npm run test:ui:debug
\`\`\`

### Docker Build Issues

\`\`\`bash
# Test Docker build locally
docker build -t test .

# Check Dockerfile syntax
docker build --check .

# View build logs
docker-compose build --progress=plain
\`\`\`

### Deployment Failures

\`\`\`bash
# Verify Vercel credentials
vercel whoami

# Test deployment locally
vercel --prod

# Check Vercel logs
vercel logs
\`\`\`

## 🔐 Security Best Practices

### Secrets Management

1. **Never commit secrets** to repository
2. **Use GitHub Secrets** for sensitive data
3. **Rotate tokens** regularly
4. **Limit secret scope** to necessary workflows

### Dependency Security

\`\`\`yaml
# Automated security updates
- name: Dependabot
  uses: dependabot/dependabot-core
\`\`\`

### Container Security

\`\`\`yaml
# Scan for vulnerabilities
- name: Trivy scan
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: 'ghcr.io/${{ github.repository }}:latest'
\`\`\`

## 📝 Workflow Examples

### Manual Deployment

\`\`\`bash
# Trigger via GitHub CLI
gh workflow run deploy.yml -f environment=staging

# Or via GitHub UI
# Actions > Deploy to Production > Run workflow
\`\`\`

### Conditional Jobs

\`\`\`yaml
deploy:
  if: github.ref == 'refs/heads/main' && github.event_name == 'push'
  runs-on: ubuntu-latest
\`\`\`

### Matrix Builds

\`\`\`yaml
test:
  strategy:
    matrix:
      node-version: [18, 20, 21]
      os: [ubuntu-latest, windows-latest]
  runs-on: ${{ matrix.os }}
\`\`\`

## 📊 Performance Optimization

### Caching

\`\`\`yaml
- uses: actions/cache@v4
  with:
    path: |
      ~/.npm
      ${{ github.workspace }}/.next/cache
    key: ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}
\`\`\`

### Parallel Jobs

\`\`\`yaml
jobs:
  test-unit:
    # Runs in parallel with other jobs
  test-e2e:
    # Runs in parallel with other jobs
  build:
    needs: [test-unit, test-e2e]  # Waits for both
\`\`\`

## 🎯 Best Practices

1. **Keep workflows DRY** - Use reusable workflows
2. **Fast feedback** - Run quick tests first
3. **Fail fast** - Stop on critical errors
4. **Cache dependencies** - Speed up builds
5. **Meaningful names** - Clear job and step names
6. **Comprehensive logs** - Easy debugging
7. **Artifact management** - Clean up old artifacts

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Build Push Action](https://github.com/docker/build-push-action)
- [Vercel GitHub Integration](https://vercel.com/docs/git/vercel-for-github)
- [Playwright CI](https://playwright.dev/docs/ci)

## 🆘 Support

For CI/CD issues:
1. Check workflow logs in GitHub Actions
2. Review this documentation
3. Test locally before pushing
4. Open an issue with workflow run link

---

**The platypus ensures your code is always ship-ready! 🦦🚀**
