module.exports = {
    apps: [
        {
            name: 'dealsagent-prod',
            script: 'npm',
            args: 'start',
            cwd: '/var/www/dealsagent',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'production',
                PORT: 3000
            }
        }
    ]
};
