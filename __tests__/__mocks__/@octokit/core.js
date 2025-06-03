module.exports = {
  Octokit: class MockOctokit {
    constructor(options) {
      this.options = options;
    }
    
    static plugin(plugin) {
      return class PluggedOctokit extends MockOctokit {
        constructor(options) {
          super(options);
          this.rest = {
            repos: {
              getLatestRelease: jest.fn().mockResolvedValue({
                data: {
                  tag_name: 'v2.10.2'  // Use a version that we know works with our tests
                }
              })
            }
          };
        }
      };
    }
  }
};