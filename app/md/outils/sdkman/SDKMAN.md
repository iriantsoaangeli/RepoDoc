## Install SDKMAN

```bash
sudo apt install curl zip unzip
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"
sdk version
```

## List and install Java

```bash
sdk list java                    # available versions (copy the Identifier column)
sdk install java 21.0.5-tem      # install a version (Temurin 21 example)
sdk install java 8.0.432-tem     # install Java 8
sdk install java                 # install the latest default version
```

> Identifiers change over time. Always copy them from `sdk list java`.

## Use a version

```bash
sdk use java 21.0.5-tem          # this terminal only
sdk default java 21.0.5-tem      # all new terminals
sdk current java                 # active version
sdk current                      # all active SDKs
```

## Per-project version

```bash
cd my-project
sdk env init                     # creates .sdkmanrc
sdk env                          # activates the version in .sdkmanrc
sdk env install                  # installs the versions in .sdkmanrc if missing
```

Auto-switch when entering a folder: set `sdkman_auto_env=true` in `~/.sdkman/etc/config`.

## Register an existing JDK (e.g. from apt)

```bash
ls /usr/lib/jvm                  # find the JDK folders
ls /usr/lib/jvm/java-21-openjdk-amd64/bin/javac   # must exist (JDK, not JRE)

sdk install java 21-system /usr/lib/jvm/java-21-openjdk-amd64
sdk install java 8-system  /usr/lib/jvm/java-8-openjdk-amd64

sdk default java 21-system
```

- Format: `sdk install java <your-name> <path-to-jdk-home>`
- The path is the folder that contains `bin/`, no trailing slash.
- Use the real folder (`java-21-openjdk-amd64`), not `default-java` or `openjdk-21`.

## Remove and update

```bash
sdk uninstall java 8-system      # removes only the SDKMAN link for local JDKs
sdk uninstall java 17.0.13-tem
sdk upgrade java                 # suggests newer versions
sdk update                       # refresh the candidate list
sdk selfupdate                   # update SDKMAN itself
```

## Other tools

```bash
sdk install maven
sdk install gradle
sdk install kotlin
sdk list                         # all available candidates
```

## Check the Java version

```bash
java -version                    # runtime
javac -version                   # compiler (JDK only)
echo $JAVA_HOME
readlink -f $(which java)        # real path of the active java
```

## Troubleshooting

| Problem | Fix |
|---|---|
| `sdk: command not found` | Open a new terminal or run `source ~/.sdkman/bin/sdkman-init.sh` |
| `java -version` differs from `sdk current java` | Remove manual `JAVA_HOME` / `PATH` java lines from `~/.bashrc` |
| "Invalid path" when registering a JDK | Use the JDK home (contains `bin/javac`), not `bin/` or a symlink |
| `javac: command not found` | Only a JRE is installed. Install the JDK (`sudo apt install openjdk-21-jdk`) |
| SDKMAN init not applied | Keep the SDKMAN init block at the **end** of `~/.bashrc` |

## IntelliJ

`File > Project Structure > SDKs > + > Add JDK`, then pick the folder, for example:

- `~/.sdkman/candidates/java/21.0.5-tem`
- `/usr/lib/jvm/java-21-openjdk-amd64`

Hidden folders: press `Ctrl+H` in the file picker, or paste the path.

## Notes

- Java 8 is also written `1.8`.
- `amd64` = `x86_64`: the normal 64-bit PC build.
- Code built with a newer JDK can target Java 8 with `javac --release 8`.