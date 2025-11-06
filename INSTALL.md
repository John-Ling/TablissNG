# How to Download the extension and add it to your browser

## Step 1: Download the Extension

### Option 1: Download from GitHub Releases (Recommended)

1. **Go to the [Releases page](https://github.com/BookCatKid/TablissNG/releases)** of the repository
2. Find the latest release
3. Download the appropriate file:
   - For Firefox: `tabliss-firefox-signed.xpi` (This file may not exist, if you need it and it is not available, please see [Downloading signed xpi from firefox store](#Downloading-signed-xpi-from-firefox-store))
   - For Chrome/Chromium: `tabliss-chromium.zip`
   - For Firefox (unsigned version): `tabliss-firefox.zip` (expert)
   - For Safari (unsigned version): `tabliss-safari.zip` (expert)

### Option 2: Download Nightly Builds from GitHub Actions

1. **Go to the Actions tab** of the repository on GitHub.
2. Click on the latest workflow with a green checkmark.
3. Scroll down to the **Artifacts** section.
4. Click on the `.zip` file to download the extension.

**Note:** If you can't download the artifacts, you may not be logged into GitHub. You can either:

- Log in to GitHub and try again
- Visit [nightly.link](https://nightly.link) and paste the artifact link there

## Step 2: Install the Extension in Your Browser

#### Firefox
  1. Go to `about\:addons`
  2. Click the gear icon
  3. Click "Install Add-on from File"
  4. Select the .zip or .xpi file you downloaded
#### Chromium
  1. Unzip the .zip file into a folder
  2. Go to `chrome://extensions/`
  3. Enable developer mode
  4. Click Load Unpacked
  5. Select the folder you unzipped to. (make sure it has manifest.json in the root)

#### Safari

For now the only way to install the safari extension is to install developer mode and install the unsigned version. I am not able to put it on the app store because to do that I would have to buy the **Apple Developer Licence** that costs **$99** a year!

  1. Unzip the downloaded zip file into a folder
  2. Enable Safari's Develop menu: Safari > Settings (Preferences) > Advanced → check `Show features for web developers`
  3. Go to the now visible `Develop` tab and click `Add temporary extension...`
  4. Select the folder you unzipped. (make sure it has manifest.json in the root)
  5. You should be brought to the `Extensions` tab and now click on the checkbox next to extension to enable it.
  6. Click `Use for new windows and tabs` to allow TablissNG to overide your new tab page. (If its not working select TablissNG for the two `New * open with` options)


### Downloading signed xpi from firefox store

- You can use the following command to download the latest signed version from the Firefox store:
```sh
curl -O $(curl -s "https://addons.mozilla.org/api/v5/addons/addon/tablissng/" | jq -r ".current_version.file.url")
```
- This will download the latest signed version of the extension. You can then install it in Firefox by following the steps above.

## Notes

- If you need extra help just create an issue and I will help.

---

Now your browser extension should be up and running!
