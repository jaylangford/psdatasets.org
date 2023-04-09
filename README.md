# PSdatasets.org

## A website for searching political science datasets.

PSdatasets.org is a website that searches through a list of datasets related to political science. Its main aim is to be a resource for researchers in political science to find new datasets. Secondary goals include speed, low cost of hosting (currently it is hosted for free on Github Pages), ease of maintenance, and ease of adding new datasets.

The search implimentation is based on [Craig Mod's])(https://cragmod.com) [fork](https://gist.github.com/cmod/5410eae147e4318164258742dd053993) of [Eddie Web's gist](https://gist.github.com/eddiewebb/735feb48f50f0ddd65ae5606a1cb41ae).

### How to contribute

If you wish to contribute a new dataset, add a row to the bottom of index.csv containing it. Be sure to include relevant tags. Please try to re-use the exact spelling and capitalizaation of existing tags where possible, eg. do not introduce 'Foreign Direct Investments' because 'foreign direct investment (FDI)' is already being used as a tag. Please make sure that you are not adding a dataset that is already in the csv file. Please use the latest dataset where available.

If you wish to contribute, you will need hugo and python:

#### On MacOS

Using [homebrew](https://brew.sh):

```{shell}
brew install hugo python
```

#### On Windows

Using [Chocolatey](https://chocolatey.org):

```{shell}
choco install hugo-extended python
```

#### After Hugo and Python Installation

Clone the repository to your local machine.

```{shell}
mkdir psdatasets.org && cd psdatasets.org && git clone https://github.com/jaylangford/psdataset.org
```

Next you will need to set up your python virtual environment.

```{shell}
python3 -m venv .venv
```

Activate the virtual environment. You will need to do this each time you start a new terminal session.

```{shell}
.venv/bin/activate
```

Make sure you have the latest version of pip.

```{shell}
python3 -m pip install -U pip
```

Then install the project requirements.

```{shell}
python3 -m pip install -r requirements.txt
```

Now you can run `{shell}python3 db.py` to build the index for the database.

With the generated index, you can then test the website locally.

```{shell}
hugo server --disableFastRender
```

Before committing, be sure to build the index and the website.

```{shell}
hugo && python3 db.py
```
