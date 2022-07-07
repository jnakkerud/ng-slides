optimize() {
    jpg=$1
    tmp1="${jpg}_tmp1.png"
    tmp2="${jpg}_tmp2.png"
    before=$(stat -f %z "${jpg}")
    cjpeg -quality 65 "${jpg}" > "${tmp1}"
    after=$(stat -f %z "${tmp1}")

    printf "	%s: %s " "${jpg}" "${before}"
    if [ "$after" -lt "$before" ]; then
	mv "${tmp1}" "${jpg}"
	echo "--> ${after}"
    else
	echo "(Already optimal)"
    fi
    rm -f "${tmp1}"
}

files=$(find . \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \))

for file in ${files}
do
    optimize "${file}"
done